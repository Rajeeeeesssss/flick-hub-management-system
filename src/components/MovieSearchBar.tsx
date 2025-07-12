
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useMoviesDb } from "@/hooks/useMoviesDb";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const MovieSearchBar = () => {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Fetch movies from database
  const { data: movies = [] } = useMoviesDb();

  // Filter movies for suggestions
  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return movies
      .filter(movie => movie.is_active) // Only show active movies
      .filter(
        (movie) =>
          movie.title.toLowerCase().includes(q) ||
          movie.genre.some((g) => g.toLowerCase().includes(q))
      );
  }, [query, movies]);

  // On select, navigate and close suggestions
  const handleSelect = (movieId: number) => {
    setOpen(false);
    setQuery("");
    navigate(`/movie/${movieId}`);
  };

  // Open the suggestion dropdown when input is focused and query is present
  React.useEffect(() => {
    if (query.trim()) setOpen(true);
    else setOpen(false);
  }, [query]);

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Search movies by name or genre..."
          className="pl-10 h-12 text-lg shadow-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(!!query.trim())}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={20} />
        </span>
        {/* Animated Suggestion Dropdown */}
        {open && (
          <div className="absolute z-50 w-full bg-popover rounded-md shadow-xl border mt-1 animate-fade-in">
            <Command shouldFilter={false}>
              <CommandInput
                className="hidden" // Hide built-in cmdk input, we use our Input above
              />
              <CommandList>
                {suggestions.length === 0 && (
                  <CommandEmpty>No movies found.</CommandEmpty>
                )}
                {suggestions.map((movie) => (
                  <CommandItem
                    key={movie.id}
                    onSelect={() => handleSelect(movie.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <img
                      src={movie.poster_url || ''}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-[6px] border"
                    />
                    <span className="font-medium">{movie.title}</span>
                    <Badge variant="secondary">{movie.genre[0]}</Badge>
                    <span className="ml-auto text-xs text-muted-foreground">{movie.release_date || ''}</span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearchBar;
