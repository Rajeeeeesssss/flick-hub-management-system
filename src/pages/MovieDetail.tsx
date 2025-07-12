import { useParams } from "react-router-dom";
import { useMoviesDb } from "@/hooks/useMoviesDb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Film, Languages, Calendar, User } from "lucide-react";
import NotFound from "./NotFound";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserBookings from "./UserBookings";
import BookTicketDialog from "@/components/BookTicketDialog";

const TICKET_PRICE = 8; // $8 per ticket

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movies = [] } = useMoviesDb();
  const movie = movies.find((m) => m.id === Number(id));
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{
    seats: string[];
    showTime: string;
    language: string;
    totalPrice: number;
  } | null>(null);

  if (!movie) {
    return <NotFound />;
  }

  const handleBookClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setDialogOpen(true);
  };

  // Show the BookTicketDialog and after confirm, send booking data to PaymentDummy (no DB writes yet)
  const handleBookConfirm = (seats: string[], showTime: string, language: string, totalPrice: number) => {
    setDialogOpen(false);
    setPendingBooking({ seats, showTime, language, totalPrice });
    navigate("/payment-dummy", {
      state: {
        movieId: movie.id,
        seats,
        showTime,
        language,
        totalPrice,
      }
    });
  };

  return (
    <div className="flex-1 animate-fade-in">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={movie.hero_url || movie.poster_url || ''} alt={movie.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/3 lg:w-1/4">
            <img src={movie.poster_url || ''} alt={movie.title} className="rounded-xl shadow-2xl w-full" />
          </div>
          <div className="md:w-2/3 lg:w-3/4 text-foreground">
            <div className="flex flex-wrap items-center gap-2">
              {movie.genre.map((g) => <Badge key={g} variant="secondary">{g}</Badge>)}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mt-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mt-4">
              <span className="flex items-center gap-2"><Calendar size={16} /> {movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> {movie.duration} min</span>
              <span className="flex items-center gap-2"><Languages size={16} /> {movie.language || 'English'}</span>
              <span className="flex items-center gap-2"><Film size={16} /> {movie.rating || 'Not Rated'}</span>
            </div>
            
            <p className="mt-8 text-lg text-foreground/80">
              {movie.description || 'No description available.'}
            </p>
            <p className="mt-4 text-muted-foreground flex items-center gap-2"><User size={16} /> Directed by {movie.director || 'Unknown'}</p>
            
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleBookClick}
                disabled={loading || bookingLoading}
              >
                {user ? "Book Tickets Now" : "Login to Book Tickets"}
              </Button>
              <BookTicketDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleBookConfirm}
                loading={bookingLoading}
              />
            </div>

            {/* Booking list for this movie, for the current user */}
            {user && (
              <div className="mt-10">
                <UserBookings movieId={movie.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
