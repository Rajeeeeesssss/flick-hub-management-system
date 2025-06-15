
import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const Header = () => {
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
