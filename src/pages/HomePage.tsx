import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGetGames } from '@/api/gamesApi'
import { GameCard } from '@/components/GameCard'
import { GameCardSkeleton } from '@/components/GameCardSkeleton'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Game } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

// Framer Motion animation variants
const heroImageVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
}

const contentVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function HomePage() {
  const { data: games, isLoading, error } = useGetGames()
  const [activeIndex, setActiveIndex] = useState(0)
  const addToCart = useCartStore((state) => state.addToCart)

  // Memoize data processing for performance
  const { trendingGames, gamesByCategory, freeGames, topCategories } = useMemo(() => {
    if (!games) return { trendingGames: [], gamesByCategory: {}, freeGames: [], topCategories: [] }
    
    // Use games with high review counts for the hero section
    const trending = [...games]
      .sort((a, b) => b.reviewsCount - a.reviewsCount)
      .slice(0, 7) // Select 7 games for the vertical list

    const free = games.filter(game => game.price === 0);
    
    const categories = games.reduce((acc, game) => {
      const primaryGenre = game.genre[0];
      if (primaryGenre && primaryGenre !== 'Free to Play') {
        if (!acc[primaryGenre]) acc[primaryGenre] = []
        acc[primaryGenre].push(game)
      }
      return acc
    }, {} as Record<string, Game[]>)

    const sortedCategories = Object.keys(categories).sort((a,b) => categories[b].length - categories[a].length).slice(0, 8);

    return { trendingGames: trending, gamesByCategory: categories, freeGames: free, topCategories: sortedCategories }
  }, [games])

  // Auto-cycle through hero games
  useEffect(() => {
    if (trendingGames.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % trendingGames.length)
      }, 7000)
      return () => clearInterval(interval)
    }
  }, [trendingGames.length])

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-red-400">Could not load games. Please try again later.</p>
      </div>
    )
  }

  const activeGame = trendingGames[activeIndex]

  return (
    <div className="-mt-8 flex w-full flex-col">
      {/* 1. HERO SECTION - EPIC GAMES STYLE */}
      <section className="relative grid min-h-[600px] w-full grid-cols-1 overflow-hidden rounded-lg bg-card md:grid-cols-3">
        {/* Left Side - Main Image and Content */}
        <div className="relative col-span-1 flex flex-col justify-end p-8 md:col-span-2">
           {/* Background Image */}
          {isLoading || !activeGame ? (
            <div className="absolute inset-0 animate-pulse bg-white/5"></div>
          ) : (
            <AnimatePresence>
              <motion.div
                key={activeGame.id}
                className="absolute inset-0 z-0"
                variants={heroImageVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <img src={activeGame.images[0]} alt={activeGame.title} className="h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Foreground Content */}
          {!isLoading && activeGame && (
             <AnimatePresence mode="wait">
              <motion.div
                key={activeGame.id}
                variants={contentVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 flex flex-col gap-4"
              >
                <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg lg:text-6xl">{activeGame.title}</h1>
                <p className="max-w-lg text-base text-white/80 drop-shadow-md">
                  {activeGame.description.substring(0, 120)}...
                </p>
                <div className="flex items-center gap-4">
                    <Link to={`/product/${activeGame.slug}`}>
                        <Button size="lg" className="text-lg whitespace-nowrap">View Game</Button>
                    </Link>
                    {activeGame.price > 0 && 
                        <Button variant="secondary" size="lg" className="text-lg" onClick={() => addToCart(activeGame)}>
                            <ShoppingCart className="mr-2 h-5 w-5" />{formatCurrency(activeGame.price)}
                        </Button>
                    }
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Right Side - Vertical Thumbnail Navigator */}
        <div className="hidden flex-col justify-center space-y-2 p-4 md:flex">
          {isLoading && Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-white/10"></div>
          ))}
          {!isLoading && trendingGames.map((game, index) => (
            <button 
              key={game.id} 
              onClick={() => setActiveIndex(index)}
              className={`flex w-full items-center gap-4 rounded-lg p-2 text-left transition-colors duration-300 ${
                activeIndex === index ? 'bg-white/20' : 'bg-transparent hover:bg-white/10'
              }`}
            >
              <img src={game.images[0]} alt={game.title} className="h-16 w-12 flex-shrink-0 rounded-md object-cover" />
              <div>
                <h3 className="text-sm font-semibold text-white">{game.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. SCROLLABLE CATEGORIES */}
      <main className="container mx-auto flex flex-col gap-12 px-4 py-16">
        {isLoading && Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="mb-6 h-8 w-1/4 animate-pulse rounded bg-white/10"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => <GameCardSkeleton key={i} />)}
            </div>
          </div>
        ))}
        
        {freeGames.length > 0 && <div>
            <h2 className="mb-6 text-3xl font-bold text-primary">Free To Play</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {freeGames.slice(0, 5).map((game) => <GameCard key={game.id} game={game} />)}
            </div>
        </div>}

        {topCategories.map((category) => (
          <div key={category}>
            <h2 className="mb-6 text-3xl font-bold text-primary">{category}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {gamesByCategory[category].slice(0, 5).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

