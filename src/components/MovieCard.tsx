
import * as React from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  style?: React.CSSProperties;
}

const MovieCard = ({ movie, className, style }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`group block overflow-hidden rounded-lg ${className}`}
      style={style}
    >
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white">{movie.title}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant="secondary">{movie.certification}</Badge>
            <span className="text-xs text-muted-foreground">{movie.genre.join(", ")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
