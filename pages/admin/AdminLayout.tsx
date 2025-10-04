import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 ${
      isActive ? 'bg-primary text-white hover:bg-primary' : ''
    }`;

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4 rounded-lg shadow">
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
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;