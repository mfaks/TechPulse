import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      await logout();
      setSignOutDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-blue-950 border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex mr-8">
              <img src="/news.svg" alt='News Icon' className='mr-2 w-8 h-8 text-white' />
              <span className="text-2xl font-bold text-white">TechPulse</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-white font-semibold underline hover:text-blue-300 hover:font-bold transform hover:scale-105 transition-all duration-200 border-b-2 border-transparent hover:border-blue-950 ${!isAuthenticated ? 'text-2xl py-2' : ''}`}
                >
                  About
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-blue-400 shadow-xl text-center relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute bg-white right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  onClick={() => {
                    const button = document.querySelector('[data-state="open"] button[data-state="closed"]') as HTMLButtonElement;
                    button?.click();
                  }}
                >
                  <X className="h-4 w-4 text-white hover:text-blue-300" />
                  <span className="sr-only">Close</span>
                </button>
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-2xl font-bold text-blue-100 text-center">
                    About TechPulse
                  </DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 space-y-6">
                      <p className="text-xl text-center underline text-blue-100">Your Personal Tech News Hub</p>
                      <div className="space-y-4">
                        <div className="bg-blue-900/50 p-4 rounded-lg">
                          <p className="text-blue-100">
                            TechPulse is your personalized gateway to the latest in technology news.
                            We aggregate and curate news from various trusted sources, allowing you to
                            stay informed about the tech topics and companies that matter most to you.
                          </p>
                        </div>
                        <div className="bg-blue-900/50 p-4 rounded-lg">
                          <p className="text-blue-100">
                            Our AI-powered platform analyzes hundreds of articles daily to bring you
                            the most relevant and impactful stories based on your interests.
                          </p>
                        </div>
                        <div className="bg-blue-900/50 p-4 rounded-lg">
                          <p className="text-blue-100">
                            Built with modern web technologies and designed with user experience in mind,
                            TechPulse helps you stay ahead in the fast-paced world of technology.
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {isAuthenticated && location.pathname === '/news' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white font-semibold underline hover:text-blue-300 hover:font-bold transform hover:scale-105 transition-all duration-200 border-b-2 border-transparent hover:border-blue-950"
                  >
                    Instructions
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-blue-400 shadow-xl text-center relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
                  <button
                    className="absolute bg-white right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    onClick={() => {
                      const button = document.querySelector('[data-state="open"] button[data-state="closed"]') as HTMLButtonElement;
                      button?.click();
                    }}
                  >
                    <X className="h-4 w-4 text-white hover:text-blue-300" />
                    <span className="sr-only">Close</span>
                  </button>
                  <DialogHeader className="space-y-4">
                    <DialogTitle className="text-2xl font-bold text-blue-100 text-center">
                      Welcome to TechPulse
                    </DialogTitle>
                    <DialogDescription>
                      <div className="mt-4 space-y-6">
                        <p className="text-xl text-center underline text-blue-100">Using TechPulse</p>
                        <div className="space-y-4">
                          <div className="bg-blue-900/50 p-4 rounded-lg flex items-start space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              1
                            </span>
                            <p className="text-blue-100">
                              Browse the sidebar to explore available tech topics and companies. Choose the ones that match your interests.
                            </p>
                          </div>
                          <div className="bg-blue-900/50 p-4 rounded-lg flex items-start space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              2
                            </span>
                            <p className="text-blue-100">
                              Select up to 3 topics and 5 companies, then click 'Create Feed' to set up your personalized news stream.
                            </p>
                          </div>
                          <div className="bg-blue-900/50 p-4 rounded-lg flex items-start space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              3
                            </span>
                            <p className="text-blue-100 text-xl">
                              Wait briefly while our AI curates your feed with the most relevant articles for your selections.
                            </p>
                          </div>
                          <div className="bg-blue-900/50 p-4 rounded-lg flex items-start space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              4
                            </span>
                            <p className="text-blue-100">
                              Update your preferences anytime by selecting new topics or companies and clicking 'Create Feed' again.
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {isAuthenticated && location.pathname === '/' && (
              <Button
                variant="ghost"
                className="text-white font-semibold underline hover:text-blue-300 hover:font-bold transform hover:scale-105 transition-all duration-200 border-b-2 border-transparent hover:border-blue-950"
                onClick={() => navigate('/news')}
              >
                News
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                onClick={() => setSignOutDialogOpen(true)}
                className="text-white font-semibold underline hover:text-red-800 hover:font-bold transform hover:scale-105 transition-all duration-200 border-b-2 border-transparent hover:border-red-800"
              >
                Sign Out
              </Button>
            )}
            <Dialog open={isSignOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
              <DialogContent className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-400 shadow-xl text-center relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <button
                  className="absolute bg-white right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  onClick={() => setSignOutDialogOpen(false)}
                >
                  <X className="h-4 w-4 text-white hover:text-red-300" />
                  <span className="sr-only">Close</span>
                </button>
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-2xl font-bold text-red-100 text-center">
                    Are you sure you want to sign out?
                  </DialogTitle>
                  <DialogDescription className="text-red-100 text-center text-lg">
                    Your data will be lost if you sign out.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center gap-4 mt-6 sm:justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSignOutDialogOpen(false)}
                    className="bg-transparent border-2 border-red-400 text-red-100 hover:bg-red-800 hover:text-red-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    Sign Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
}