import { useGetGames } from '@/api/gamesApi';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';

export function FreeGamesPage() {
  const { data: games, isLoading, error } = useGetGames();

  // Filter for games where the price is 0
  const freeGames = games?.filter(game => game.price === 0);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-primary">Free to Play</h1>
      <p className="text-lg text-text-muted">
        Discover a collection of games that you can play for free.
      </p>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <GameCardSkeleton key={i} />)}
        </div>
      )}

      {error && <p className="text-red-400">Error loading games. Please try again later.</p>}

      {freeGames && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {freeGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

       {freeGames?.length === 0 && !isLoading && (
         <p className="py-12 text-center text-lg text-text-muted">No free games found at this time.</p>
      )}
    </div>
  );
}
