
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMoviesDb } from "@/hooks/useMoviesDb";
import MovieCard from "@/components/MovieCard";
import MovieSearchBar from "@/components/MovieSearchBar";
import StaffSection from "@/components/StaffSection";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch movies from database
  const { data: movies = [] } = useMoviesDb();

  const { data: promotions } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .gte("end_date", new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
      return data;
    },
  });

  // Filter movies from database - only show active movies
  const filteredMovies = movies
    .filter(movie => movie.is_active) // Only show active movies
    .filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-r from-primary/80 to-primary/60 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Flick Hub
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            Your ultimate destination for the latest movies and unforgettable cinema experiences
          </p>
          <MovieSearchBar />
        </div>
      </section>

      {/* Promotions Section */}
      {promotions && promotions.length > 0 && (
        <section className="py-16 bg-secondary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Current Promotions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="bg-white rounded-lg shadow-md p-6 border border-primary/10">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{promotion.title}</h3>
                  {promotion.description && (
                    <p className="text-muted-foreground mb-3">{promotion.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      {promotion.discount_percentage ? `${promotion.discount_percentage}% OFF` : 
                       promotion.discount_amount ? `$${promotion.discount_amount} OFF` : 'Special Offer'}
                    </div>
                    {promotion.promo_code && (
                      <div className="bg-primary/10 px-3 py-1 rounded text-primary font-mono text-sm">
                        Code: {promotion.promo_code}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Valid until {new Date(promotion.end_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Movies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Now Showing</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={{
                id: movie.id,
                title: movie.title,
                genre: movie.genre,
                duration: movie.duration,
                rating: movie.rating || 'Not Rated',
                releaseDate: movie.release_date || '',
                director: movie.director || '',
                description: movie.description || '',
                posterUrl: movie.poster_url || '',
                heroUrl: movie.hero_url || '',
                language: movie.language || 'English',
                certification: movie.rating || 'U'
              }} />
            ))}
          </div>
          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No movies found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Staff Section */}
      <StaffSection />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Flick Hub?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold">Latest Movies</h3>
              <p className="text-muted-foreground">
                Catch the newest blockbusters and indie films as soon as they're released
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎟️</span>
              </div>
              <h3 className="text-xl font-semibold">Easy Booking</h3>
              <p className="text-muted-foreground">
                Simple and quick ticket booking with seat selection and payment options
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold">Premium Experience</h3>
              <p className="text-muted-foreground">
                State-of-the-art screens, sound systems, and comfortable seating
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
