import { Link, useNavigate } from 'react-router-dom';
import { Game } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from './ui/Button';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type GameCardProps = {
  game: Game;
};

export function GameCard({ game }: GameCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuthenticated) {
      addToCart(game);
      // TODO: Add a toast notification for "Added to cart"
    } else {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
  };

  const hasDiscount = game.discount && game.discount > 0;
  const currentPrice = hasDiscount ? game.price * (1 - game.discount!) : game.price;

  return (
    <Link 
      to={`/product/${game.slug}`} 
      className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-card shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={game.images[0]}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {hasDiscount && (
          <span className="absolute top-2 right-2 rounded-md bg-secondary px-2 py-1 text-sm font-bold">
            -{(game.discount! * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-lg font-semibold text-text" title={game.title}>
          {game.title}
        </h3>
        <p className="text-sm text-text-muted">{game.genre.join(', ')}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400" fill="currentColor" />
            <span className="text-sm font-medium">{game.rating.toFixed(1)}</span>
            <span className="text-xs text-text-muted">({game.reviewsCount})</span>
          </div>
          <div className="flex gap-1">
            {game.platforms.slice(0, 3).map((p) => (
              <span key={p} className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-text-muted">{p}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-1 items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-text-muted line-through">
                {formatCurrency(game.price)}
              </span>
            )}
            <span className="text-xl font-bold text-primary">
              {formatCurrency(currentPrice)}
            </span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={handleAddToCart}
            aria-label={`Add ${game.title} to cart`}
          >
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </Link>
  );
}
