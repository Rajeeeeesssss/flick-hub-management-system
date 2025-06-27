
import { movies } from "@/data/movies";
import MovieCard from "@/components/MovieCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MovieSearchBar from "@/components/MovieSearchBar";

const Home = () => {
  const heroMovie = movies[0];

  return (
    <div className="flex-1">
      {/* Movie SearchBar */}
      <MovieSearchBar />
      {/* Hero section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] animate-fade-in">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={heroMovie.heroUrl} alt={heroMovie.title} className="w-full h-full object-cover"/>
        <div className="absolute z-20 bottom-0 left-0 p-8 md:p-12 lg:p-16 text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter" style={{ animationDelay: '0.2s' }}>
            {heroMovie.title}
          </h1>
          <p className="mt-2 md:mt-4 max-w-lg text-lg text-foreground/80" style={{ animationDelay: '0.4s' }}>
            {heroMovie.description}
          </p>
          <div className="mt-6 flex gap-4" style={{ animationDelay: '0.6s' }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to={`/movie/${heroMovie.id}`}>Book Tickets</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black">
              <Link to={`/movie/${heroMovie.id}`}>View Details</Link>
            </Button>
            {/* Admin button removed */}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <main className="container py-12">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Now Showing</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie, index) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

