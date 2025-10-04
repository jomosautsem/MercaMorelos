import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserIcon, ShoppingCartIcon, LogoutIcon, SearchIcon, ChevronDownIcon, ArchiveBoxIcon, EnvelopeIcon } from './icons';

const Header: React.FC = () => {
  const { cartCount, isAuthenticated, logout, user, setSearchQuery, unreadMessagesCount } = useAppContext();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim() === '') return;
    setSearchQuery(localQuery);
    navigate('/search');
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              MercaMorelos
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink 
                  to="/category/dama" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-on-surface-secondary hover:bg-gray-100'}`}
                >
                  Dama
                </NavLink>
                <NavLink 
                  to="/category/nino" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-on-surface-secondary hover:bg-gray-100'}`}
                >
                  Niño
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-secondary text-white' : 'text-on-surface-secondary hover:bg-gray-100'}`}
                  >
                    Panel de Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center px-4">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Buscar productos..."
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary"
                  aria-label="Menú de usuario"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <UserIcon />
                  <span className="text-sm text-on-surface-secondary hidden sm:inline-block mx-2">Hola, {user?.firstName}</span>
                  <ChevronDownIcon className="w-4 h-4 hidden sm:inline-block"/>
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical">
                    <div className="py-1" role="none">
                     {user?.role === 'customer' && (
                        <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">
                            <ArchiveBoxIcon className="mr-3"/>
                            Mis Pedidos
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">
                        <LogoutIcon className="mr-3"/>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary" aria-label="Iniciar sesión">
                <UserIcon />
              </Link>
            )}

            {/* Cart and Messages are not available for admins */}
            {user?.role !== 'admin' && (
                <>
                  {/* Messages are only for logged-in customers */}
                  {user?.role === 'customer' && (
                    <Link to="/messages" className="relative p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary" aria-label="Messages">
                      <EnvelopeIcon />
                      {unreadMessagesCount > 0 && (
                          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                          {unreadMessagesCount}
                          </span>
                      )}
                    </Link>
                  )}
                  {/* Cart is for customers and anonymous users */}
                  <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary" aria-label="Carrito de compras">
                    <ShoppingCartIcon />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                        {cartCount}
                        </span>
                    )}
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;