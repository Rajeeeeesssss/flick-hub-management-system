import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Booking = {
  id: string;
  movie_id: number;
  status: string;
  created_at: string;
  cancelled_at: string | null;
  show_time: string;
  seat_number: string;
};

const UserBookings = ({ movieId }: { movieId: number }) => {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchBooking();
    // eslint-disable-next-line
  }, [user, movieId]);

  const fetchBooking = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user!.id)
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setBooking(data || null);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!booking) return;
    setLoading(true);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", booking.id)
      .eq("user_id", user!.id);
    setLoading(false);
    if (error) {
      toast({ title: "Cancel Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Booking Cancelled", description: "Your booking was cancelled." });
    fetchBooking();
  };

  if (!user) return null;
  if (loading) return <div className="text-muted-foreground">Loading your booking...</div>;

  if (!booking) return (
    <div className="text-muted-foreground text-sm">No booking for this movie yet.</div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="text-green-700 text-sm">
        Booking active since {new Date(booking.created_at).toLocaleString()}.
        <br />
        <span className="font-semibold">Show time:</span> {new Date(booking.show_time).toLocaleString()}<br />
        <span className="font-semibold">Seat:</span> {booking.seat_number}
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleCancel}
        disabled={loading}
      >
        {loading ? "Cancelling..." : "Cancel Booking"}
      </Button>
    </div>
  );
};

export default UserBookings;
