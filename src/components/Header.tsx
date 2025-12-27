import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { TrendingUp } from 'lucide-react'

export default function Header() {
  const handleNavbarClick = () => {
    // Clear navigation source to ensure homepage scrolls to top
    sessionStorage.removeItem("navigation-source");
  };

  return (
    <header className="w-full max-w-[1800px] mx-auto px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3" onClick={handleNavbarClick}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Thesivest
          </span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors" onClick={handleNavbarClick}>Discover</Link>
        <Link to="/tournaments" className="hover:text-primary transition-colors" onClick={handleNavbarClick}>Tournaments</Link>
        <Link to="/" className="hover:text-primary transition-colors" onClick={handleNavbarClick}>Contributors</Link>
      </nav>
      <Link to="/login" onClick={handleNavbarClick}>
        <Button className="bg-muted hover:bg-muted/80 text-foreground border-border" variant="outline">
          Sign In
        </Button>
      </Link>
    </header>
  )
}
