import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetGameBySlug } from '@/api/gamesApi';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, PlayCircle, ChevronLeft, ChevronRight, Award, Swords, Smile, Puzzle, Users } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

type MediaItem = {
  type: 'video' | 'image';
  url: string;
  thumbnail: string;
};

const RatingCard = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-card p-6 text-center h-full">
        <div className="text-primary">{icon}</div>
        <p className="text-sm text-text-muted">{text}</p>
    </div>
);

const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const fullStars = Math.round(rating);
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) => (
                <svg key={i} className={`h-6 w-6 ${i < fullStars ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.91l6.561-.955L10 1l2.95 5.955 6.561.955-4.756 3.635 1.123 6.545z" />
                </svg>
            ))}
        </div>
    );
};

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: game, isLoading, error } = useGetGameBySlug(slug);
  const addToCart = useCartStore((state) => state.addToCart);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [detailedDescription, setDetailedDescription] = useState('');
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);

  // --- AI DESCRIPTION GENERATION ---
  useEffect(() => {
    if (game) {
        const generateDescription = async () => {
            setIsDescriptionLoading(true);
            const prompt = `Write an engaging and detailed "About this game" section for the game "${game.title}". 
            Expand on this short description: "${game.description}". 
            Discuss the core gameplay loop, the story's premise, and what makes this game unique. 
            Format the response into two or three paragraphs. Do not use markdown headings or lists.`;

            try {
                const apiKey = ""; // API key is handled by the environment
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
                
                const payload = { contents: [{ parts: [{ text: prompt }] }] };
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Failed to generate description');
                
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                
                setDetailedDescription(text || game.description);
            } catch (apiError) {
                console.error("Gemini API Error:", apiError);
                setDetailedDescription(game.description); // Fallback to short description on error
            } finally {
                setIsDescriptionLoading(false);
            }
        };
        generateDescription();
    }
  }, [game]);

  const mediaGallery: MediaItem[] = useMemo(() => {
    if (!game) return [];
    const items: MediaItem[] = [];
    if (game.trailerUrl) {
      items.push({ type: 'video', url: game.trailerUrl, thumbnail: game.images[1] || game.images[0] });
    }
    game.images.forEach(imgUrl => items.push({ type: 'image', url: imgUrl, thumbnail: imgUrl }));
    return items;
  }, [game]);
  
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const selectedMedia = mediaGallery[selectedMediaIndex];

  // --- ROBUST VIDEO AUTOPLAY FIX ---
  useEffect(() => {
    if (selectedMedia?.type === 'video' && videoRef.current) {
        const videoElement = videoRef.current;
        videoElement.muted = true; // Muting is ESSENTIAL for autoplay
        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay was prevented by browser. User interaction may be required.", error);
                videoElement.controls = true; // Show controls as a fallback
            });
        }
    }
  }, [selectedMedia]);
  
  useEffect(() => {
    if (game?.trailerUrl) setSelectedMediaIndex(0);
  }, [game]);

  if (isLoading) return <PageSpinner />;
  if (error || !game) return <p className="text-center text-red-400">Game not found.</p>;

  const hasDiscount = game.discount && game.discount > 0;
  const currentPrice = hasDiscount ? game.price * (1 - game.discount!) : game.price;

  const handleAction = (action: 'addToCart' | 'buyNow') => {
      if (isAuthenticated) {
          addToCart(game);
          if (action === 'buyNow') navigate('/checkout');
      } else {
          navigate('/login');
      }
  };

  const getRatingCards = () => {
    const cards = [];
    if(game.rating > 4.5) cards.push(<RatingCard key="recommended" icon={<Award size={32} />} text="Highly Recommended" />);
    if(game.tags.includes('Story Rich')) cards.push(<RatingCard key="story" icon={<Puzzle size={32} />} text="Amazing Storytelling" />);
    if(game.tags.includes('Challenging')) cards.push(<RatingCard key="combat" icon={<Swords size={32} />} text="Challenging Combat" />);
    if(game.tags.includes('Multiplayer')) cards.push(<RatingCard key="multiplayer" icon={<Users size={32} />} text="Competitive Players" />);
    if(cards.length < 4) cards.push(<RatingCard key="beginners" icon={<Smile size={32} />} text="Great for Beginners" />);
    return cards.slice(0, 4);
  };

  return (
    <div className="flex flex-col gap-16">
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-card shadow-lg">
            {selectedMedia?.type === 'video' ? (
              <video ref={videoRef} key={selectedMedia.url} className="h-full w-full" autoPlay loop muted playsInline poster={selectedMedia.thumbnail}>
                <source src={selectedMedia.url} type="video/webm" />
              </video>
            ) : <img src={selectedMedia?.url} alt={`${game.title} screenshot`} className="h-full w-full object-cover"/>}
            <Button onClick={() => setSelectedMediaIndex((prev) => (prev - 1 + mediaGallery.length) % mediaGallery.length)} size="icon" variant="secondary" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-50 transition-opacity hover:opacity-100"><ChevronLeft /></Button>
            <Button onClick={() => setSelectedMediaIndex((prev) => (prev + 1) % mediaGallery.length)} size="icon" variant="secondary" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-50 transition-opacity hover:opacity-100"><ChevronRight /></Button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {mediaGallery.map((item, index) => (
              <button key={index} onClick={() => setSelectedMediaIndex(index)} className={`relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md transition-all duration-300 ${selectedMediaIndex === index ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}>
                <img src={item.thumbnail} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                {item.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><PlayCircle className="h-8 w-8 text-white/80" /></div>}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <h1 className="text-4xl font-bold lg:text-5xl">{game.title}</h1>
            <p className="rounded-md bg-white/10 px-3 py-1 text-sm font-medium self-start inline-block">Base Game</p>
            <div className="flex flex-col items-start gap-2">
              {hasDiscount && <span className="text-lg text-text-muted line-through">{formatCurrency(game.price)}</span>}
              <span className="text-4xl font-bold">{formatCurrency(currentPrice)}</span>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => handleAction('buyNow')} size="lg" className="w-full bg-blue-500 text-lg hover:bg-blue-600">Buy Now</Button>
              <Button onClick={() => handleAction('addToCart')} size="lg" className="w-full text-lg" disabled={game.stock === 0}><ShoppingCart className='mr-2 h-5 w-5' />{game.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</Button>
              <Button size="lg" className="w-full text-lg" variant="secondary">Add to Wishlist</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold">About This Game</h2>
              {isDescriptionLoading ? (
                <div className="space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-white/10"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-white/10"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-white/10"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-white/10"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-white/10"></div>
                </div>
              ) : (
                <p className="text-base leading-relaxed text-text-muted whitespace-pre-line">{detailedDescription}</p>
              )}
          </div>
          <div>
              <h2 className="text-2xl font-bold mb-4">Epic Player Ratings</h2>
              <div className="flex items-center gap-2 mb-6">
                  <span className="text-4xl font-bold">{game.rating.toFixed(1)}</span>
                  <StarRating rating={game.rating} />
              </div>
              <div className="grid grid-cols-2 gap-4">{getRatingCards()}</div>
          </div>
      </section>

      {game.systemRequirements && (
        <section className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold mb-8">{game.title} System Requirements</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-white/10">Minimum</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between"><span>OS</span><span className="text-text-muted text-right">{game.systemRequirements.os}</span></div>
                        <div className="flex justify-between"><span>Processor</span><span className="text-text-muted text-right">{game.systemRequirements.cpu}</span></div>
                        <div className="flex justify-between"><span>Memory</span><span className="text-text-muted text-right">{game.systemRequirements.ram}</span></div>
                        <div className="flex justify-between"><span>Graphics</span><span className="text-text-muted text-right">{game.systemRequirements.gpu}</span></div>
                        <div className="flex justify-between"><span>Storage</span><span className="text-text-muted text-right">{game.systemRequirements.storage}</span></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-white/10">Recommended</h3>
                     <div className="space-y-4 text-sm">
                        <div className="flex justify-between"><span>OS</span><span className="text-text-muted text-right">Windows 11</span></div>
                        <div className="flex justify-between"><span>Processor</span><span className="text-text-muted text-right">Intel Core i7-10700, AMD Ryzen 7 3700X</span></div>
                        <div className="flex justify-between"><span>Memory</span><span className="text-text-muted text-right">16 GB RAM</span></div>
                        <div className="flex justify-between"><span>Graphics</span><span className="text-text-muted text-right">Nvidia RTX 3060Ti, AMD RX 6700-XT</span></div>
                        <div className="flex justify-between"><span>Storage</span><span className="text-text-muted text-right">{game.systemRequirements.storage} (SSD Recommended)</span></div>
                    </div>
                </div>
            </div>
        </section>
      )}
    </div>
  );
}

