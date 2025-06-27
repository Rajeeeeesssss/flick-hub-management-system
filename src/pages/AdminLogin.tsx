
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

const ADMIN_EMAIL = "rajesh9933123@gmail.com";

type AuthView = "admin-login" | "admin-otp";

const AdminLogin = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [authView, setAuthView] = useState<AuthView>("admin-login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading } = useAdminRole(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect after successful admin login
  if (!authLoading && user && window.location.pathname === "/admin-login") {
    setTimeout(() => navigate("/admin"), 100);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Redirecting to admin dashboard...</span>
      </div>
    );
  }

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: "global" }); } catch {}

    if (authView === "admin-otp") {
      // Admin OTP login
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/admin-login`
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
    } else {
      // Admin password login
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
          title: "Admin Login Success",
          description: "Logged in! Redirecting to admin dashboard...",
        });
        window.location.href = "/admin";
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleAdminAuth} className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full space-y-6 border">
        <div className="flex justify-end">
          <a href="/" className="text-primary text-xs underline">Back to Home</a>
        </div>
        <h1 className="font-bold text-2xl text-center">
          {authView === "admin-otp" ? "Admin: OTP Login" : "Admin Login"}
        </h1>
        <div>
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            disabled
            className="mt-1 bg-gray-100"
          />
        </div>
        <div className="flex gap-2 mt-2 mb-2 justify-center">
          <Button
            type="button"
            size="sm"
            variant={authView === "admin-login" ? "default" : "outline"}
            onClick={() => { setAuthView("admin-login"); setOtpSent(false); setError(null); }}
          >
            Login with Password
          </Button>
          <Button
            type="button"
            size="sm"
            variant={authView === "admin-otp" ? "default" : "outline"}
            onClick={() => { setAuthView("admin-otp"); setOtpSent(false); setError(null); }}
          >
            Login with OTP
          </Button>
        </div>
        {authView === "admin-login" && (
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1"
              autoComplete="current-password"
            />
          </div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {/* Admin OTP button or status */}
        {authView === "admin-otp" && (
          otpSent ? (
            <div className="text-green-600 text-sm">
              OTP link sent! Check admin email to continue and login as admin.
            </div>
          ) : (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : "Send OTP to Admin Email"}
            </Button>
          )
        )}
        {/* Admin password login button */}
        {authView === "admin-login" && (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : "Admin Login"}
          </Button>
        )}
        <div className="text-center text-xs mt-4">
          <a
            href="/auth"
            className="text-primary underline"
          >Go to User Login</a>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
