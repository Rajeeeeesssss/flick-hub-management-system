
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cleanupAuthState } from "@/hooks/cleanupAuth";
import { useToast } from "@/hooks/use-toast";

/**
 * OTP-only email authentication page for login, signup, password reset.
 */
type AuthView = "login" | "signup" | "reset";

// Only used for redirect logic after log in
const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to homepage if already logged in
  if (!authLoading && user && window.location.pathname === "/auth") {
    setTimeout(() => navigate("/"), 100);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Redirecting...</span>
      </div>
    );
  }

  // Send OTP link to email for login/signup/reset
  const handleOtpAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setOtpSent(false);

    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch {}

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
      toast({
        variant: "default",
        title: "OTP Sent",
        description: authView === "reset"
          ? "Password reset email sent! Check your inbox."
          : "OTP/magic link sent! Please check your email.",
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setOtpSent(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {/* Home link only */}
      <div className="w-full max-w-md text-left p-3">
        <a href="/" className="text-primary underline font-medium text-sm">← Home</a>
      </div>
      <form
        onSubmit={handleOtpAuth}
        className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full space-y-6 border"
      >
        <h1 className="font-bold text-2xl text-center">
          {{
            login: "Sign In with OTP",
            signup: "Sign Up with OTP",
            reset: "Reset Password via OTP"
          }[authView]}
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
            disabled={otpSent}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {/* OTP status */}
        {otpSent && (
          <div className="text-green-600 text-center text-sm">
            {authView === "reset"
              ? "Reset email sent! Check your inbox."
              : "OTP/magic link sent! Check your inbox to complete login."}
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
        {/* Auth view switching */}
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
                  <br />
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
      </form>
    </div>
  );
};

export default AuthPage;

