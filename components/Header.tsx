import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserIcon, ShoppingCartIcon, LogoutIcon, SearchIcon, ChevronDownIcon, ArchiveBoxIcon, EnvelopeIcon, Cog6ToothIcon, MenuIcon, XIcon, HeartIcon } from './icons';

const Header: React.FC = () => {
  const { cartCount, isAuthenticated, logout, user, setSearchQuery, unreadMessagesCount, wishlist } = useAppContext();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);


  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
    `relative px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-slate-900 font-bold' : 'text-slate-700 hover:text-slate-900'}`;
  
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-md text-base font-medium ${isActive ? 'bg-primary text-slate-900' : 'text-on-surface hover:bg-surface-light'}`;


  return (
    <>
      <header className="bg-primary sticky top-0 z-40 shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img className="h-16 w-auto" src="/logo.png" alt="MercaMorelos Logo" />
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
                    to="/category/kids" 
                    className={navLinkClass}
                  >
                    Kids
                  </NavLink>
                  <NavLink 
                    to="/category/caballero" 
                    className={navLinkClass}
                  >
                    Caballero
                  </NavLink>
                  {user?.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-semibold ${isActive ? 'bg-orange-400 text-slate-900' : 'text-slate-700 hover:text-slate-900'}`}
                    >
                      Panel de Admin
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center px-2 sm:px-4 lg:px-8">
              <form onSubmit={handleSearch} className="w-full max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="text-slate-600" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-2.5 border border-transparent bg-white/50 rounded-full leading-5 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:bg-white/75 sm:text-sm transition-all"
                    placeholder="Buscar..."
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="flex items-center p-2 rounded-full hover:bg-primary-focus/20 text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-slate-800"
                      aria-label="Menú de usuario"
                      aria-haspopup="true"
                      aria-expanded={isDropdownOpen}
                    >
                      <UserIcon />
                      <span className="text-sm text-slate-800 hidden sm:inline-block mx-2 font-medium">Hola, {user?.firstName}</span>
                      <ChevronDownIcon className="w-4 h-4 hidden sm:inline-block"/>
                    </button>
                    {isDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-surface/80 backdrop-blur-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical">
                        <div className="py-1" role="none">
                        {user?.role === 'customer' && (
                            <>
                              <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-surface-light hover:text-on-surface" role="menuitem">
                                  <Cog6ToothIcon className="mr-3"/>
                                  Mi Perfil
                              </Link>
                              <Link to="/wishlist" onClick={() => setIsDropdownOpen(false)} className="text-on-surface-secondary flex items-center px-4 py-2 text-sm hover:bg-surface-light hover:text-on-surface" role="menuitem">
                                  <HeartIcon className="mr-3 w-5 h-5"/>
                                  Mi Lista de Deseos
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
                  <Link to="/auth" className="p-2 rounded-full hover:bg-primary-focus/20 text-slate-800" aria-label="Iniciar sesión">
                    <UserIcon />
                  </Link>
                )}
              </div>

              {user?.role !== 'admin' && (
                  <>
                    {user?.role === 'customer' && (
                      <>
                        <Link to="/messages" className="relative p-2 rounded-full hover:bg-primary-focus/20 text-slate-800" aria-label="Messages">
                            <EnvelopeIcon />
                            {unreadMessagesCount > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 font-bold">
                                {unreadMessagesCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-primary-focus/20 text-slate-800" aria-label="Wishlist">
                            <HeartIcon />
                            {wishlist.length > 0 && (
                                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 font-bold">
                                {wishlist.length}
                                </span>
                            )}
                        </Link>
                      </>
                    )}
                    <Link to="/cart" className="relative p-2 rounded-full hover:bg-primary-focus/20 text-slate-800" aria-label="Carrito de compras">
                      <ShoppingCartIcon />
                      {cartCount > 0 && (
                          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 font-bold">
                          {cartCount}
                          </span>
                      )}
                    </Link>
                  </>
              )}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-full hover:bg-primary-focus/20 text-slate-800"
                  aria-label="Abrir menú"
                >
                  <MenuIcon />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
      >
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="absolute inset-0 bg-black/60"
          aria-label="Cerrar menú"
        ></div>
        
        <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-surface/80 backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-border-color">
            <h2 className="text-xl font-bold text-primary-focus">Menú</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 rounded-full text-on-surface-secondary hover:bg-surface-light"
              aria-label="Cerrar menú"
            >
              <XIcon />
            </button>
          </div>
          
          <nav className="p-4 space-y-2">
            <NavLink to="/category/dama" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Dama</NavLink>
            <NavLink to="/category/kids" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Kids</NavLink>
            <NavLink to="/category/caballero" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Caballero</NavLink>
            
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Panel de Admin</NavLink>
            )}

            <hr className="border-border-color my-4"/>

            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-md text-base font-medium text-on-surface hover:bg-surface-light">
                      <Cog6ToothIcon className="mr-3"/> Mi Perfil
                    </Link>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-md text-base font-medium text-on-surface hover:bg-surface-light">
                      <HeartIcon className="mr-3 w-5 h-5"/> Mi Lista de Deseos
                    </Link>
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-md text-base font-medium text-on-surface hover:bg-surface-light">
                      <ArchiveBoxIcon className="mr-3"/> Mis Pedidos
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 rounded-md text-base font-medium text-on-surface hover:bg-surface-light">
                  <LogoutIcon className="mr-3"/> Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-md text-base font-medium text-on-surface hover:bg-surface-light">
                <UserIcon className="mr-3"/> Iniciar Sesión / Registrarse
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;