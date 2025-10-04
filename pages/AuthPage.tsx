
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      const newUser: User = {
        firstName: formData.firstName,
        paternalLastName: formData.paternalLastName,
        maternalLastName: formData.maternalLastName,
        email: formData.email,
        address: formData.address,
      };
      // In a real app, you would send this to a server.
      // Here we just log the user in.
      login(newUser);
      navigate('/checkout');
    } else {
      // Mock login - in a real app, you'd verify credentials
      if (formData.email && formData.password) {
        const mockUser: User = {
            firstName: 'Usuario',
            paternalLastName: 'Demo',
            maternalLastName: '',
            email: formData.email,
            address: '123 Calle Falsa, Ciudad Demo',
        };
        login(mockUser);
        navigate('/');
      } else {
          setError('Por favor, introduce correo y contraseña.');
      }
    }
  };

  const FormField: React.FC<{ name: keyof typeof formData; label: string; type?: string; required?: boolean }> = ({ name, label, type = 'text', required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-on-surface-secondary">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
    </div>
  );

  return (
    <div className="flex justify-center items-center py-10">
      <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">{isRegistering ? 'Crear una Cuenta' : 'Iniciar Sesión'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {isRegistering && (
                <>
                    <FormField name="firstName" label="Nombre" />
                    <FormField name="paternalLastName" label="Apellido Paterno" />
                    <FormField name="maternalLastName" label="Apellido Materno" />
                    <FormField name="address" label="Dirección de envío" />
                </>
            )}
            <FormField name="email" label="Correo Electrónico" type="email" />
            <FormField name="password" label="Contraseña" type="password" />
            {isRegistering && (
                <FormField name="confirmPassword" label="Confirmar Contraseña" type="password" />
            )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-on-surface-secondary">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
          <button onClick={() => setIsRegistering(!isRegistering)} className="font-medium text-primary hover:text-primary-focus ml-1">
            {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
