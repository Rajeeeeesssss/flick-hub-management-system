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
 * Email/password authentication page for login and signup.
 */

type AuthView = "login" | "register";

const AuthPage = () => {
  const [authView, setAuthView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  // Register fields
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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

  const resetForm = () => {
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirm("");
    setLoginEmail("");
    setLoginPassword("");
    setErrors(null);
    setRegisterSuccess(false);
  };

  // Register a new user
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setRegisterSuccess(false);

    if (!registerName.trim()) {
      setErrors("Name is required.");
      return;
    }
    if (!registerEmail.trim()) {
      setErrors("Email is required.");
      return;
    }
    if (!registerPassword) {
      setErrors("Password is required.");
      return;
    }
    if (registerPassword !== registerConfirm) {
      setErrors("Passwords do not match.");
      return;
    }
    setLoading(true);

    cleanupAuthState();
    try {
      // Sign up and set the meta data for full_name only.
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: window.location.origin + "/auth",
          data: {
            full_name: registerName,
          },
        },
      });

      if (error) {
        setErrors(error.message || "Registration failed");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
        return;
      }

      // Upsert the user's profile with full_name only
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: registerName,
        });
      }

      setLoading(false);
      setRegisterSuccess(true);
      toast({
        variant: "default",
        title: "Sign Up Successful!",
        description:
          "Your account has been created. Please check your email to confirm and then log in.",
      });
      setTimeout(() => setAuthView("login"), 1800);
    } catch (err: any) {
      setErrors("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  // Log in with email / password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    if (!loginEmail || !loginPassword) {
      setErrors("Please enter your email and password.");
      return;
    }
    setLoading(true);

    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch {}

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setLoading(false);

    if (error) {
      setErrors(error.message || "Login failed");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } else if (data.user) {
      toast({
        variant: "default",
        title: "Logged In",
        description: "You are now logged in!",
      });
      // Force refresh/redirect to home
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {/* Home link only */}
      <div className="w-full max-w-md text-left p-3">
        <a href="/" className="text-primary underline font-medium text-sm">
          ← Home
        </a>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full border">
        {/* Auth toggle */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-md font-semibold ${
              authView === "login"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            } transition-colors`}
            onClick={() => {
              setAuthView("login");
              resetForm();
            }}
            disabled={authView === "login"}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-semibold ${
              authView === "register"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            } transition-colors ml-2`}
            onClick={() => {
              setAuthView("register");
              resetForm();
            }}
            disabled={authView === "register"}
          >
            Register
          </button>
        </div>
        {authView === "login" ? (
          // Login View
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="login_email">Email</Label>
              <Input
                id="login_email"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="login_password">Password</Label>
              <Input
                id="login_password"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Your password"
                required
                className="mt-1"
              />
            </div>
            {errors && <div className="text-red-600 text-sm">{errors}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center mt-3">
              <span
                className="text-primary underline text-xs cursor-pointer"
                onClick={() => setAuthView("register")}
              >
                Don't have an account? Register
              </span>
            </div>
          </form>
        ) : (
          // Register View
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="register_name">Full Name</Label>
              <Input
                id="register_name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Your full name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="register_email">Email</Label>
              <Input
                id="register_email"
                type="email"
                autoComplete="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="register_password">Password</Label>
              <Input
                id="register_password"
                type="password"
                autoComplete="new-password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Choose a password"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="register_confirm">Confirm Password</Label>
              <Input
                id="register_confirm"
                type="password"
                autoComplete="off"
                value={registerConfirm}
                onChange={(e) => setRegisterConfirm(e.target.value)}
                placeholder="Confirm your password"
                required
                className="mt-1"
              />
            </div>
            {errors && <div className="text-red-600 text-sm">{errors}</div>}
            {registerSuccess && (
              <div className="text-green-600 text-center text-sm">
                Registered successfully! Please check your email, then log in.
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <div className="text-center mt-3">
              <span
                className="text-primary underline text-xs cursor-pointer"
                onClick={() => setAuthView("login")}
              >
                Already have an account? Login
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
