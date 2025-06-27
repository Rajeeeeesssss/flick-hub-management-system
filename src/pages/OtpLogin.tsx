
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const OtpLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/auth",
      },
    });

    setLoading(false);

    if (error) {
      setErrors(error.message || "Failed to send magic link");
      toast({
        variant: "destructive",
        title: "Error sending link",
        description: error.message,
      });
    } else {
      setSent(true);
      toast({
        title: "Magic link sent!",
        description:
          "Check your email inbox (and spam/promotions) for the login link.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md text-left p-3">
        <a href="/auth" className="text-primary underline font-medium text-sm">
          ← Back to Login
        </a>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full border">
        <h2 className="text-xl font-bold mb-4 text-center">OTP / Magic Link Login</h2>
        <form className="space-y-5" onSubmit={handleOtpLogin}>
          <div>
            <Label htmlFor="otp_email">Email Address</Label>
            <Input
              id="otp_email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1"
              disabled={sent}
            />
          </div>
          {errors && <div className="text-red-600 text-sm">{errors}</div>}
          <Button type="submit" className="w-full" disabled={loading || sent}>
            {loading ? "Sending..." : sent ? "Sent!" : "Send Magic Link"}
          </Button>
        </form>
        {sent && (
          <div className="text-green-700 mt-4 text-center text-sm">
            If the email exists, a magic login link was sent!
            <br />
            <span className="text-xs">
              (Check spam or promotions folders. Link expires soon.)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpLogin;
