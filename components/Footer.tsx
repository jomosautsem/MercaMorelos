import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-gray-200 mt-12">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-on-surface-secondary">
        <p>&copy; {new Date().getFullYear()} MercaMorelos. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">La mejor moda para dama y niño.</p>
      </div>
    </footer>
  );
};

export default Footer;