import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { cleanupAuthState } from "@/hooks/cleanupAuth";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";

const ADMIN_EMAIL = "rajesh9933123@gmail.com";

type AuthView = "admin-otp";

const AdminLogin = () => {
  const [email] = useState(ADMIN_EMAIL); // Locked to admin
  const [authView] = useState<AuthView>("admin-otp");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin } = useAdminRole(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle OTP verification from URL on component mount
  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        setVerifying(true);
        try {
          // Manually set the session from URL tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            throw error;
          }
          
          toast({
            title: "Login Successful",
            description: "Welcome back, Admin!",
          });
          
          // Redirect to admin page after successful verification
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
          
        } catch (error: any) {
          setError(error.message);
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: error.message,
          });
        } finally {
          setVerifying(false);
        }
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  // Show verification loading state
  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-primary/80 text-white">
        <span className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-400 animate-pulse" />
          Verifying your login...
        </span>
      </div>
    );
  }

  // Redirect after successful admin login (but not during verification)
  if (!authLoading && user && !verifying) {
    setTimeout(() => navigate("/admin"), 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-primary/80 text-white">
        <span className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-green-400" />
          Redirecting to admin dashboard...
        </span>
      </div>
    );
  }

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: "global" }); } catch {}

    // Admin OTP login only, no secret code
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-primary/80">
      <form onSubmit={handleAdminAuth} className="p-8 bg-white/95 rounded-xl shadow-2xl max-w-md w-full border-2 border-primary space-y-7 backdrop-blur-md relative">
        <div className="flex justify-between mb-2">
          <span className="flex items-center gap-2 text-primary font-bold text-md tracking-wide">
            <ShieldAlert className="w-5 h-5 text-primary" />
            ADMIN SECURE PORTAL
          </span>
          <a href="/" className="text-xs underline text-primary/70">Home</a>
        </div>
        <h1 className="font-black text-3xl text-center text-primary drop-shadow">Admin OTP Login</h1>
        <div className="border-y border-primary/10 py-3 flex flex-col gap-5">
          <div>
            <Label htmlFor="admin-email" className="font-semibold text-primary">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              disabled
              className="mt-1 bg-gray-100 font-mono text-gray-700"
            />
          </div>
        </div>
        {error && <div className="bg-red-100 text-red-700 text-sm rounded px-3 py-2">{error}</div>}
        {/* Admin OTP button or status */}
        {!otpSent ? (
          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={loading}>
            {loading ? "Please wait..." : "Send OTP to Admin Email"}
          </Button>
        ) : (
          <div className="bg-green-100 text-green-800 text-center text-sm rounded px-3 py-2">
            OTP link sent! Check admin email to complete login.
          </div>
        )}
        <div className="absolute top-2 right-2 text-[10px] text-primary/30">Admin Only</div>
      </form>
    </div>
  );
};

export default AdminLogin;
