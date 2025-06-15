import { Link, useNavigate } from "react-router-dom";
import { Film, LogIn, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/hooks/cleanupAuth";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (e) {
      // Ignore errors
    }
    window.location.href = "/auth";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Flick Hub</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Movies
          </Link>
          <Link
            to="/admin-login"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Admin
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md hover:bg-muted/80">
                <UserIcon className="w-4 h-4" />
                <span className="font-semibold text-xs truncate max-w-[100px]" title={user.email || undefined}>
                  {user.email}
                </span>
              </Link>
              <Button onClick={handleSignOut} size="sm" variant="ghost" disabled={loggingOut}>
                <LogOut className="w-4 h-4" /> <span className="sr-only">Sign out</span>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              variant="default"
            >
              <Link to="/auth" className="flex items-center gap-1">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
