
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentDummy = () => {
  const navigate = useNavigate();

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
