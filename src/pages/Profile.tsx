
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { movies } from "@/data/movies";
import { User, Calendar, X } from "lucide-react";

type Booking = {
  id: string;
  movie_id: number;
  status: string;
  created_at: string;
  cancelled_at: string | null;
  show_time: string;
  seat_number: string;
};

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
    // eslint-disable-next-line
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setBookings(data || []);
    setLoading(false);
  };

  const handleCancel = async (bookingId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", bookingId)
      .eq("user_id", user!.id);
    setLoading(false);
    if (error) {
      toast({ title: "Cancel Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Booking Cancelled", description: "Your booking was cancelled." });
    fetchBookings();
  };

  if (!user) return <div className="p-8 text-red-500 text-center">Please login to view your profile.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6" />
        <h2 className="text-2xl font-bold">My Bookings</h2>
      </div>
      {loading && <div className="text-muted-foreground">Loading your bookings...</div>}
      {!loading && bookings.length === 0 && <div className="text-muted-foreground">No bookings found.</div>}
      {!loading && bookings.length > 0 && (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => {
            const movie = movies.find((m) => m.id === b.movie_id);
            return (
              <div key={b.id} className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-background">
                <div>
                  <div className="font-bold">{movie?.title || "Movie #" + b.movie_id}</div>
                  <div className="text-muted-foreground text-sm flex gap-2 items-center">
                    <Calendar size={14} /> {new Date(b.show_time).toLocaleString()} | 
                    <span className="ml-2 font-semibold">Seat:</span> {b.seat_number}
                  </div>
                  <div className="mt-1 text-xs">
                    Booked: {new Date(b.created_at).toLocaleString()}
                    {b.status === "cancelled" && b.cancelled_at && (
                      <span className="ml-2 text-orange-600">Cancelled: {new Date(b.cancelled_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div>
                  {b.status === "active" ? (
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(b.id)} disabled={loading}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  ) : (
                    <span className="px-3 py-1 rounded bg-muted text-xs text-muted-foreground">Cancelled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;

