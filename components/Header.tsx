
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserIcon, ShoppingCartIcon, LogoutIcon } from './icons';

const Header: React.FC = () => {
  const { cartCount, isAuthenticated, logout, user } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              MercaPago
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
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-on-surface-secondary hidden sm:block">Hola, {user?.firstName}</span>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary" aria-label="Cerrar sesión">
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary" aria-label="Iniciar sesión">
                <UserIcon />
              </Link>
            )}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 text-on-surface-secondary" aria-label="Carrito de compras">
              <ShoppingCartIcon />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
