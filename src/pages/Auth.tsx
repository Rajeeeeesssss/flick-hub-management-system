import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { cleanupAuthState } from "@/hooks/cleanupAuth";
import { useToast } from "@/hooks/use-toast";

type AuthView = "login" | "signup" | "otp";
const ADMIN_EMAIL = "rajesh9933123@gmail.com";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [signupConfirmation, setSignupConfirmation] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: loadingAdminRole } = useAdminRole(user?.id);
  const { toast } = useToast();

  // Redirect logic - wait for auth loading before redirect
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

    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      // Ignore
    }

    // Admin OTP login
    if (authView === "otp" && email === ADMIN_EMAIL) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
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
          description: "Magic login link sent to admin email!",
        });
      }
      return;
    }

    if (authView === "signup") {
      // Validation
      if (!email || !password || !confirmPassword || !fullName || !phone) {
        setError("All fields are required.");
        toast({
          variant: "destructive",
          title: "Signup Error",
          description: "All fields are required."
        });
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        toast({
          variant: "destructive",
          title: "Signup Error",
          description: "Passwords do not match."
        });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { full_name: fullName, phone },
        }
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Signup Error",
          description: error.message
        });
      } else {
        setSignupConfirmation(true);
        toast({
          variant: "default",
          title: "Signup Success",
          description: "Check your email to verify and complete signup."
        });
      }
      return;
    }

    if (authView === "login") {
      if (!email || !password) {
        setError("Email and password are required.");
        toast({
          variant: "destructive",
          title: "Login Error",
          description: "Email and password are required."
        });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message,
        });
      } else {
        toast({
          variant: "default",
          title: "Login Success",
          description: "Logged in! Redirecting...",
        });
        window.location.href = "/";
      }
    }
  };

  // Manual login mode switching logic
  // Don't force OTP/login on admin email input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setOtpSent(false);
    setError(null);
    // Don't force switch between views; user can pick
  };

  // Manual login mode switch UI when admin email is detected
  const showAdminOptions = email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleAuth} className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full space-y-6 border">
        <h1 className="font-bold text-2xl text-center">
          {authView === "otp"
            ? "Admin: OTP Login"
            : authView === "login"
            ? "Sign In"
            : "Sign Up"}
        </h1>
        {/* New fields for signup */}
        {(authView === "signup") && (
          <>
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
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="mt-1"
              />
            </div>
          </>
        )}
        {/* All views: email input */}
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

        {/* Admin login options when admin email is entered */}
        {showAdminOptions && (
          <div className="flex gap-2 mt-2 mb-2 justify-center">
            <Button
              type="button"
              size="sm"
              variant={authView === "login" ? "default" : "outline"}
              onClick={() => { setAuthView("login"); setOtpSent(false); setError(null);} }
            >
              Login with Password
            </Button>
            <Button
              type="button"
              size="sm"
              variant={authView === "otp" ? "default" : "outline"}
              onClick={() => { setAuthView("otp"); setOtpSent(false); setError(null);} }
            >
              Login with OTP
            </Button>
          </div>
        )}

        {/* For non-admin or for admin in login mode: password fields */}
        {(authView === "login" && (!showAdminOptions || (showAdminOptions && authView==="login"))) && (
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
        {(authView === "signup") && (
          <>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="mt-1"
              />
            </div>
          </>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {/* Show confirmation on successful signup */}
        {signupConfirmation && (
          <div className="text-green-600 text-center text-sm">
            A verification email has been sent.<br />
            Please check your inbox and click the confirmation link to verify your email.
          </div>
        )}

        {/* Admin OTP button or status */}
        {authView === "otp" && showAdminOptions && (
          otpSent ? (
            <div className="text-green-600 text-sm">
              OTP link sent! Check admin email to continue and login as admin.
            </div>
          ) : (
            <Button type="submit" className="w-full" disabled={loading || signupConfirmation}>
              {loading ? "Please wait..." : "Send OTP to Admin Email"}
            </Button>
          )
        )}

        {/* Regular login/signup button */}
        {(authView !== "otp" || !showAdminOptions) && !signupConfirmation && (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : authView === "login" ? "Login" : "Sign up"}
          </Button>
        )}

        {/* Auth view switching for signup/login */}
        <div className="text-center text-sm mt-2">
          {/* Only show switch for non-otp, non-admin modes */}
          {(!showAdminOptions || authView !== "otp") && !signupConfirmation && (
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
        {/* Admin role warning for admin login */}
        {showAdminOptions && user && !loadingAdminRole && !isAdmin && (
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
