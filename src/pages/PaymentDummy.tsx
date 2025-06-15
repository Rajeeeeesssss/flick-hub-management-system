
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TICKET_PRICE = 8; // ensure same as in other files

const PaymentDummy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Receive booking details passed via navigation state
  const bookingInfo = location.state as
    | {
        movieId: number;
        seats: string[];
        showTime: string;
        language: string;
        totalPrice: number;
      }
    | undefined;

  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  // When payment is "confirmed" and user clicks pay, we'll book the tickets
  const handlePayment = async () => {
    if (!user || !bookingInfo) {
      navigate("/");
      return;
    }
    setLoading(true);

    // Compute showDate from showTime and today
    const today = new Date();
    const [hour, min] = bookingInfo.showTime.split(":");
    const showDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hour), parseInt(min), 0);
    // Prepare batch insert for all selected seats
    const inserts = bookingInfo.seats.map(seat => ({
      user_id: user.id,
      movie_id: bookingInfo.movieId,
      seat_number: seat,
      show_time: showDate.toISOString(),
      status: "active",
      language: bookingInfo.language,
    }));

    // Check if any booking exists for same seat/time
    const { data: existing } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .eq("movie_id", bookingInfo.movieId)
      .eq("status", "active")
      .eq("show_time", showDate.toISOString());

    if (existing && existing.some(b => bookingInfo.seats.includes(b.seat_number))) {
      setLoading(false);
      toast({
        title: "Seat already booked",
        description: "You already booked one or more of the selected seats at this time!",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const { error } = await supabase.from("bookings").insert(inserts);
    setLoading(false);
    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } else {
      setBooked(true);
      toast({
        title: "Booking Success",
        description: `Booked ${bookingInfo.seats.length} ticket${bookingInfo.seats.length > 1 ? 's' : ''}!`,
      });
    }
  };

  // Show details during unconfirmed payment
  if (!bookingInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">No payment session found!</h2>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  if (!booked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Confirm Payment</h2>
        <div className="bg-muted rounded-md p-6 mb-4 max-w-md w-full text-center flex flex-col gap-2">
          <div>
            <span className="font-semibold">Movie</span>: {bookingInfo.movieId}
          </div>
          <div>
            <span className="font-semibold">Seats</span>: {bookingInfo.seats.join(", ")}
          </div>
          <div>
            <span className="font-semibold">Price per ticket</span>: ${TICKET_PRICE.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">Total</span>: <span className="font-bold">${bookingInfo.totalPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-semibold">Language</span>: {bookingInfo.language}
          </div>
          <div>
            <span className="font-semibold">Show Time</span>: {bookingInfo.showTime}
          </div>
        </div>
        <Button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : `Pay $${bookingInfo.totalPrice.toFixed(2)}`}
        </Button>
      </div>
    );
  }

  // Payment/booking complete screen
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-4">
      <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-center">Payment Successful!</h2>
      <p className="mb-6 text-muted-foreground text-center">
        Thank you for your booking. Your payment has been processed successfully.<br />
        You can view your tickets in your <span className="font-medium">profile</span>.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/")}>Back to Home</Button>
        <Button variant="outline" onClick={() => navigate("/profile")}>
          Go to My Profile
        </Button>
      </div>
    </div>
  );
};

export default PaymentDummy;

