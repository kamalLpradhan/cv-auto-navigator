
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileUp, 
  Search, 
  ListChecks, 
  CreditCard,
  Menu, 
  X 
} from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '@/providers/AuthProvider';

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <NavLink 
          to="/" 
          className="text-foreground font-semibold text-xl md:text-2xl flex items-center gap-2 transition-transform hover:scale-[1.02] duration-300"
        >
          <span className="text-primary">CV</span>Navigator
        </NavLink>
        
        {isMobile ? (
          <>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated && <ProfileDropdown />}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative z-50"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
            
            {/* Mobile Menu */}
            <div 
              className={`fixed inset-0 bg-background/95 backdrop-blur-sm transition-all duration-300 z-40 ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `flex flex-col items-center text-lg font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Home className="mb-1" size={24} />
                  Home
                </NavLink>
                <NavLink 
                  to="/upload" 
                  className={({ isActive }) => `flex flex-col items-center text-lg font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileUp className="mb-1" size={24} />
                  Upload CV
                </NavLink>
                <NavLink 
                  to="/apply" 
                  className={({ isActive }) => `flex flex-col items-center text-lg font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Search className="mb-1" size={24} />
                  Jobs
                </NavLink>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `flex flex-col items-center text-lg font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ListChecks className="mb-1" size={24} />
                  Applications
                </NavLink>
                <NavLink 
                  to="/pricing" 
                  className={({ isActive }) => `flex flex-col items-center text-lg font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="mb-1" size={24} />
                  Pricing
                </NavLink>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <nav className="flex items-center space-x-1 mr-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Home className="mr-2" size={18} />
                Home
              </NavLink>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <FileUp className="mr-2" size={18} />
                Upload CV
              </NavLink>
              <NavLink 
                to="/apply" 
                className={({ isActive }) => `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Search className="mr-2" size={18} />
                Jobs
              </NavLink>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <ListChecks className="mr-2" size={18} />
                Applications
              </NavLink>
              <NavLink 
                to="/pricing" 
                className={({ isActive }) => `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <CreditCard className="mr-2" size={18} />
                Pricing
              </NavLink>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              {isAuthenticated && <ProfileDropdown />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
