
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { cleanupAuthState } from "@/hooks/cleanupAuth";

type AuthView = "login" | "signup" | "otp";

const ADMIN_EMAIL = "rajesh9933123@gmail.com";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: loadingAdminRole } = useAdminRole(user?.id);

  // Only redirect once auth/user & admin loading are BOTH complete
  if (!authLoading && user && window.location.pathname === "/auth") {
    setTimeout(() => navigate("/"), 100);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Redirecting...</span>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Clean up ALL stale login/session data before logging in/out
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (err) {
      // Ignore error on logout
    }

    // Admin: use OTP "magic link" flow
    if (email === ADMIN_EMAIL && authView === "otp") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      setLoading(false);
      if (error) setError(error.message);
      else setOtpSent(true);
      return;
    }

    if (authView === "signup") {
      // Customer signup flow
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName }
        }
      });
      setLoading(false);
      if (error) setError(error.message);
      else alert("Check your email to confirm your registration!");
      return;
    }

    if (authView === "login") {
      // Normal customer login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) setError(error.message);
      else {
        window.location.href = "/";
      }
    }
  };

  // Detect email field for switching to OTP view for admin email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError(null);
    if (value === ADMIN_EMAIL) {
      setAuthView("otp");
    } else {
      setAuthView("login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleAuth} className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full space-y-6 border">
        <h1 className="font-bold text-2xl text-center">
          {email === ADMIN_EMAIL
            ? "Admin: OTP Login"
            : authView === "login"
            ? "Sign In"
            : "Sign Up"}
        </h1>
        {(authView === "signup") && (
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-1"
            />
          </div>
        )}
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
        {/* Show password for non-admin */}
        {(authView === "login" && email !== ADMIN_EMAIL) && (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1"
            />
          </div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {email === ADMIN_EMAIL && authView === "otp" && (
          otpSent ? (
            <div className="text-green-600 text-sm">
              OTP link sent! Check email to continue and login as admin.
            </div>
          ) : (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : "Send OTP to Admin Email"}
            </Button>
          )
        )}

        {(email !== ADMIN_EMAIL || authView !== "otp") && (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : authView === "login" ? "Login" : "Sign up"}
          </Button>
        )}

        <div className="text-center text-sm mt-2">
          {(email !== ADMIN_EMAIL || authView !== "otp") && (
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
                </>
              ) : (
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
              )}
            </>
          )}
        </div>

        {/* Admin role warning */}
        {email === ADMIN_EMAIL && user && !loadingAdminRole && !isAdmin && (
          <div className="bg-yellow-100 border text-yellow-900 px-3 py-2 rounded text-sm mt-2">
            <b>Admin role not yet granted!</b><br />
            Please contact support or use Supabase dashboard to manually assign the "admin" role to your account.
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthPage;
