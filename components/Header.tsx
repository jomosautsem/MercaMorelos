import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserIcon, ShoppingCartIcon, LogoutIcon, SearchIcon, ChevronDownIcon, ArchiveBoxIcon, EnvelopeIcon, Cog6ToothIcon } from './icons';

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-secondary hover:text-on-surface'}`;


  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-surface-light/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-extrabold text-primary tracking-tight">
              MercaMorelos
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink 
                  to="/category/dama" 
                  className={navLinkClass}
                >
                  Dama
                </NavLink>
                <NavLink 
                  to="/category/nino" 
                  className={navLinkClass}
                >
                  Niño
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-semibold ${isActive ? 'bg-secondary text-white' : 'text-on-surface-secondary hover:text-on-surface'}`}
                  >
                    Panel de Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center px-4 lg:px-8">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-2.5 border border-surface-light bg-surface-light/50 rounded-full leading-5 text-on-surface placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Buscar productos..."
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center p-2 rounded-full hover:bg-surface-light text-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"
                  aria-label="Menú de usuario"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <UserIcon />
                  <span className="text-sm text-on-surface hidden sm:inline-block mx-2 font-medium">Hola, {user?.firstName}</span>
                  <ChevronDownIcon className="w-4 h-4 hidden sm:inline-block"/>
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-20 focus:outline-none" role="menu" aria-orientation="vertical">
                    <div className="py-1" role="none">
                     {user?.role === 'customer' && (
                        <>
                          <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-surface-light hover:text-on-surface" role="menuitem">
                              <Cog6ToothIcon className="mr-3"/>
                              Mi Perfil
                          </Link>
                          <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-surface-light hover:text-on-surface" role="menuitem">
                              <ArchiveBoxIcon className="mr-3"/>
                              Mis Pedidos
                          </Link>
                        </>
                      )}
                      <button onClick={handleLogout} className="w-full text-left text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-surface-light hover:text-on-surface" role="menuitem">
                        <LogoutIcon className="mr-3"/>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="p-2 rounded-full hover:bg-surface-light text-on-surface-secondary" aria-label="Iniciar sesión">
                <UserIcon />
              </Link>
            )}

            {user?.role !== 'admin' && (
                <>
                  {user?.role === 'customer' && (
                    <Link to="/messages" className="relative p-2 rounded-full hover:bg-surface-light text-on-surface-secondary" aria-label="Messages">
                      <EnvelopeIcon />
                      {unreadMessagesCount > 0 && (
                          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 font-bold">
                          {unreadMessagesCount}
                          </span>
                      )}
                    </Link>
                  )}
                  <Link to="/cart" className="relative p-2 rounded-full hover:bg-surface-light text-on-surface-secondary" aria-label="Carrito de compras">
                    <ShoppingCartIcon />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-primary text-background text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 font-bold">
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