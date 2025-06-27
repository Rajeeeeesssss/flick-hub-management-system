
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cleanupAuthState } from "@/hooks/cleanupAuth";
import { useToast } from "@/hooks/use-toast";
import AuthLoginForm from "./AuthLoginForm";
import AuthRegisterForm from "./AuthRegisterForm";

type AuthView = "login" | "register";

/**
 * Email/password authentication page for login and signup.
 */
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

  // Field change handlers for subcomponents
  const handleLoginInput = (type: "email" | "password", val: string) => {
    if (type === "email") setLoginEmail(val);
    else setLoginPassword(val);
  };

  const handleRegisterInput = (
    type: "name" | "email" | "password" | "confirm",
    val: string
  ) => {
    if (type === "name") setRegisterName(val);
    else if (type === "email") setRegisterEmail(val);
    else if (type === "password") setRegisterPassword(val);
    else setRegisterConfirm(val);
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
          <AuthLoginForm
            loading={loading}
            loginEmail={loginEmail}
            loginPassword={loginPassword}
            errors={errors}
            handleLogin={handleLogin}
            onInputChange={handleLoginInput}
            gotoRegister={() => {
              setAuthView("register");
              resetForm();
            }}
          />
        ) : (
          <AuthRegisterForm
            loading={loading}
            registerName={registerName}
            registerEmail={registerEmail}
            registerPassword={registerPassword}
            registerConfirm={registerConfirm}
            errors={errors}
            registerSuccess={registerSuccess}
            handleRegister={handleRegister}
            onInputChange={handleRegisterInput}
            gotoLogin={() => {
              setAuthView("login");
              resetForm();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
