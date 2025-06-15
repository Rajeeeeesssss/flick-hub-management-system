
import { useParams, Link } from "react-router-dom";
import { movies, Movie } from "@/data/movies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Film, Languages, Calendar, User } from "lucide-react";
import NotFound from "./NotFound";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return <NotFound />;
  }

  return (
    <div className="flex-1 animate-fade-in">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={movie.heroUrl} alt={movie.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/3 lg:w-1/4">
            <img src={movie.posterUrl} alt={movie.title} className="rounded-xl shadow-2xl w-full" />
          </div>
          <div className="md:w-2/3 lg:w-3/4 text-foreground">
            <div className="flex flex-wrap items-center gap-2">
              {movie.genre.map((g) => <Badge key={g} variant="secondary">{g}</Badge>)}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mt-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mt-4">
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> {movie.duration} min</span>
              <span className="flex items-center gap-2"><Languages size={16} /> {movie.language}</span>
              <span className="flex items-center gap-2"><Film size={16} /> {movie.certification}</span>
            </div>
            
            <p className="mt-8 text-lg text-foreground/80">
              {movie.description}
            </p>
            <p className="mt-4 text-muted-foreground flex items-center gap-2"><User size={16} /> Directed by {movie.director}</p>
            
            <div className="mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Book Tickets Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
