import { useGetGames } from '@/api/gamesApi';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';

export function DealsPage() {
  const { data: games, isLoading, error } = useGetGames();

  // Filter for games that have a discount property greater than 0
  const discountedGames = games?.filter(game => game.discount && game.discount > 0);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-primary">On Sale Now</h1>
      <p className="text-lg text-text-muted">
        Check out the best deals and discounts available in the store.
      </p>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <GameCardSkeleton key={i} />)}
        </div>
      )}

      {error && <p className="text-red-400">Error loading games. Please try again later.</p>}

      {discountedGames && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {discountedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {discountedGames?.length === 0 && !isLoading && (
         <p className="py-12 text-center text-lg text-text-muted">No deals available at the moment. Check back soon!</p>
      )}
    </div>
  );
}
