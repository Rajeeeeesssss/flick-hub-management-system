
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cleanupAuthState } from "@/hooks/cleanupAuth";
import { useToast } from "@/hooks/use-toast";

// AuthView: login, signup, or reset password
type AuthView = "login" | "signup" | "reset";
const ADMIN_EMAIL = "rajesh9933123@gmail.com";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect logic: after successful login
  if (!authLoading && user && window.location.pathname === "/auth") {
    setTimeout(() => navigate("/"), 100);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Redirecting...</span>
      </div>
    );
  }

  // OTP Magic Link: for login/signup/reset
  const handleOtpAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setOtpSent(false);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch {}

    // All flows: signInWithOtp
    let actionDesc = "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: authView === "signup",
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "OTP Error",
        description: error.message,
      });
    } else {
      setOtpSent(true);
      if (authView === "login") actionDesc = "Login link sent! Check your email (including spam).";
      else if (authView === "signup") actionDesc = "Signup complete! Check your email for the login link.";
      else actionDesc = "Reset link sent! Check your email for OTP/magic link.";
      toast({
        variant: "default",
        title: "OTP Sent",
        description: actionDesc,
      });
    }
  };

  // Change state for signup/login/reset
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setOtpSent(false);
    setError(null);
  };

  // UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleOtpAuth} className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full space-y-6 border">
        {/* Home navigation */}
        <div className="flex justify-between">
          <a href="/" className="text-primary text-xs underline">Home</a>
        </div>
        <h1 className="font-bold text-2xl text-center">
          {authView === "login" ? "Sign In with OTP" : authView === "signup" ? "Sign Up with OTP" : "Reset Password via OTP"}
        </h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email@company.com"
            required
            className="mt-1"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {/* OTP status */}
        {otpSent && (
          <div className="text-green-600 text-center text-sm">
            {authView === "reset"
              ? "Reset link sent! Check your inbox for the OTP/magic link."
              : "OTP/magic link sent! Check your inbox to complete the login."}
          </div>
        )}
        {/* Send OTP button */}
        {!otpSent && (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : authView === "login"
                ? "Send Login OTP"
                : authView === "signup"
                  ? "Send Signup OTP"
                  : "Send Reset OTP"}
          </Button>
        )}
        {/* Auth view switching for signup/login/reset */}
        <div className="text-center text-sm mt-2">
          {!otpSent && (
            <>
              {authView === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setAuthView("signup")}
                  >
                    Sign up
                  </button>
                  <br/>
                  Forgot password?{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setAuthView("reset")}
                  >
                    Reset
                  </button>
                </>
              ) : authView === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setAuthView("login")}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Back to{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setAuthView("login")}
                  >
                    Login
                  </button>
                </>
              )}
            </>
          )}
        </div>
        {/* Helper info */}
        {!user && (
          <div className="text-center text-sm mt-6 text-muted-foreground">
            <b>Trouble logging in?</b>
            <div>
              - Make sure you entered your email correctly.<br/>
              - Check spam if you don't see your OTP link.<br/>
              - Try logging out on all devices and clear cookies/localStorage.
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthPage;

