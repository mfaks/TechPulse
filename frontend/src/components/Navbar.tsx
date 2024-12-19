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
} from "@/components/ui/dialog";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex mr-8">
              <img src="/news.svg" alt='News Icon' className='mr-2 w-8 h-8 text-blue-600' />
              <span className="text-2xl font-bold text-blue-600">TechPulse</span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search Tech Topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated && location.pathname === '/news' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Instructions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Welcome to TechPulse</DialogTitle>
                    <DialogDescription>
                      <div className="mt-4 space-y-4">
                        <p>Here's how to use TechPulse:</p>
                        <div className="space-y-2">
                          <p>1. Use the sidebar to find the tech topics and companies you're interested in.</p>
                          <p>2. Select up to 3 topics and 5 companies from the sidebar, then press 'Create Feed' when you're done.</p>
                          <p>3. Wait for your custom feed to be generated.</p>
                          <p>You can change your topics and companies at any time. Just press 'Create Feed' to update your results.</p>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => navigate(location.pathname === '/news' ? '/' : '/news')}
                >
                  {location.pathname === '/news' ? 'Home' : 'News'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600">TechPulse</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}