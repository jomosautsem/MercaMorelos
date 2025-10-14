import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
      isActive ? 'bg-primary text-white' : 'text-on-surface-secondary hover:bg-surface-light hover:text-on-surface'
    }`;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 bg-surface p-4 rounded-lg shadow-lg flex-shrink-0">
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className={navLinkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClasses}>
            Productos
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClasses}>
            Pedidos
          </NavLink>
          <NavLink to="/admin/customers" className={navLinkClasses}>
            Clientes
          </NavLink>
           <NavLink to="/admin/products/archived" className={navLinkClasses}>
            Archivados
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 bg-surface p-6 rounded-lg shadow-lg">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;