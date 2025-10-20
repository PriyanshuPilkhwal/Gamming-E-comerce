import { useState } from 'react'
import { useGetGames } from '@/api/gamesApi'
import { GameCard } from '@/components/GameCard'
import { Input } from '@/components/ui/Input'
import { PageSpinner } from '@/components/ui/Spinner'
import { Game } from '@/types'
import { Search } from 'lucide-react'

// Simple client-side search
function useGameSearch(games: Game[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredGames = games?.filter((game) => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return { searchTerm, setSearchTerm, filteredGames }
}

export function BrowsePage() {
  const { data: games, isLoading, error } = useGetGames()
  const { searchTerm, setSearchTerm, filteredGames } = useGameSearch(games)

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-primary">Browse All Games</h1>
      
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-grow">
          <Input
            type="search"
            placeholder="Search by title or genre..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        </div>
        {/* TODO: Implement full filters */}
        <select className="h-10 rounded-md border border-white/20 bg-card px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          <option>Filter by Genre</option>
          <option>Action</option>
          <option>RPG</option>
          <option>Racing</option>
        </select>
        <select className="h-10 rounded-md border border-white/20 bg-card px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          <option>Sort by Popularity</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* Games Grid */}
      {isLoading && <PageSpinner />}
      {error && <p className="text-red-400">Error loading games. Please try again later.</p>}
      {filteredGames && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
      {filteredGames?.length === 0 && (
         <p className="py-12 text-center text-lg text-text-muted">No games found matching your criteria.</p>
      )}
    </div>
  )
}