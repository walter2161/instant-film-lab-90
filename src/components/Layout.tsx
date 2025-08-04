import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Home, Plus, Library } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                LEDTV
              </span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link to="/">
                <Button 
                  variant={isActive("/") ? "cinema" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Início
                </Button>
              </Link>
              
              <Link to="/create">
                <Button 
                  variant={isActive("/create") ? "cinema" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Criar Filme
                </Button>
              </Link>
              
              <Link to="/my-movies">
                <Button 
                  variant={isActive("/my-movies") ? "cinema" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Library className="w-4 h-4" />
                  Minhas Criações
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};