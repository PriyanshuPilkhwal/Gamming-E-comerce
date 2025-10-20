import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useGetGames } from '@/api/gamesApi';
import { Game } from '@/types';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

const fuseOptions = {
  keys: ['title', 'genre', 'tags'],
  includeScore: true,
  threshold: 0.4,
};

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: games } = useGetGames();
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = new Fuse(games || [], fuseOptions);
  const results = searchTerm ? fuse.search(searchTerm).slice(0, 5) : [];

  // Keyboard shortcut "/" to open search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const closeSearch = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm text-text-muted transition-colors hover:bg-white/10 hover:text-text"
        aria-label="Open search"
      >
        <SearchIcon size={18} />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden rounded bg-white/10 px-2 py-1 text-xs md:inline">/</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={closeSearch}>
      <div className="mx-auto mt-[15vh] max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for games..."
            className="h-12 w-full pl-12 text-lg"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <button onClick={closeSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
            <X />
          </button>
        </div>
        {results.length > 0 && (
          <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-lg border border-white/10 bg-card p-2">
            {results.map(({ item }: { item: Game }) => (
              <Link
                key={item.id}
                to={`/product/${item.slug}`}
                onClick={closeSearch}
                className="flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-white/10"
              >
                <img src={item.images[0]} alt={item.title} className="h-16 w-12 rounded object-cover" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-text">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.genre.join(', ')}</p>
                </div>
                <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
