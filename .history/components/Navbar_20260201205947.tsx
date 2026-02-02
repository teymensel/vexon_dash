import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, ExternalLink, User, LogOut, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Komutlar', path: '/commands' },
    { name: 'Premium', path: '/premium' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isDashboard ? 'bg-[#0f1016]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Vexon</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {!isDashboard && (
              <div className="flex gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-primary'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {isDashboard ? (
                <div className="relative">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                  >
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                      alt="User" 
                      className="w-8 h-8 rounded-full bg-primary/20"
                    />
                    <span className="text-sm font-medium text-white">Roxiyell</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#181920] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-sm text-white font-medium">Roxiyell</p>
                        <p className="text-xs text-gray-400">#1234</p>
                      </div>
                      
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <LayoutDashboard size={16} />
                        Sunucularım
                      </Link>
                      <Link to="/premium" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <User size={16} />
                        Abonelikler
                      </Link>
                      <div className="my-2 border-t border-white/5"></div>
                      <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={16} />
                        Çıkış Yap
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                    Reklam Ver
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Giriş Yap
                    <ExternalLink size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0f1016] border-b border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {!isDashboard && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
               <button className="w-full px-4 py-3 text-center text-sm font-medium text-white bg-white/5 rounded-lg border border-white/5">
                Reklam Ver
              </button>
              <button 
                onClick={() => {
                    navigate('/dashboard');
                    setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-center text-sm font-bold text-white bg-primary rounded-lg shadow-lg shadow-primary/20"
              >
                {isDashboard ? 'Kontrol Paneli' : 'Giriş Yap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;