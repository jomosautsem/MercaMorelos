import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-light border-t border-border-color mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-on-surface-secondary">
        <p>&copy; {new Date().getFullYear()} MercaMorelos. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">La vanguardia en moda para dama y niño.</p>
      </div>
    </footer>
  );
};

export default Footer;