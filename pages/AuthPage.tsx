
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const FormField: React.FC<{
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}> = ({ name, label, value, onChange, type = 'text', required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-on-surface-secondary">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
        />
    </div>
);

const initialFormData = {
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
};

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setInfoMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        const result = await register({
            firstName: formData.firstName,
            paternalLastName: formData.paternalLastName,
            maternalLastName: formData.maternalLastName,
            email: formData.email,
            address: formData.address,
            password: formData.password,
        });
        
        if (result.success) {
            setInfoMessage(result.message);
            setFormData(initialFormData);
            setIsRegistering(false); // Switch to login view
        } else {
            setError(result.message);
        }
    } else { // Login logic
        const { error: loginError } = await login(formData.email, formData.password);
        if (loginError) {
            setError(loginError);
        }
        // Successful login is now handled by the onAuthStateChange listener in AppContext.
        // It will set the user and automatically navigate away from this page.
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-10">
      <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-lg border border-border-color">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-tight">{isRegistering ? 'Crear una Cuenta' : 'Iniciar Sesión'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            {infoMessage && <p className="text-blue-600 text-sm text-center bg-blue-100 p-3 rounded-md">{infoMessage}</p>}
            {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md">{error}</p>}
            {isRegistering && (
                <>
                    <FormField name="firstName" label="Nombre" value={formData.firstName} onChange={handleChange} />
                    <FormField name="paternalLastName" label="Apellido Paterno" value={formData.paternalLastName} onChange={handleChange} />
                    <FormField name="maternalLastName" label="Apellido Materno" value={formData.maternalLastName} onChange={handleChange} />
                    <FormField name="address" label="Dirección de envío" value={formData.address} onChange={handleChange} />
                </>
            )}
            <FormField name="email" label="Correo Electrónico" type="email" value={formData.email} onChange={handleChange} />
            <FormField name="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} />
            {isRegistering && (
                <FormField name="confirmPassword" label="Confirmar Contraseña" type="password" value={formData.confirmPassword} onChange={handleChange} />
            )}
            
            {!isRegistering && (
                 <div className="text-right text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary-focus hover:text-amber-600">¿Olvidaste tu contraseña?</Link>
                 </div>
            )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-slate-900 bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary disabled:bg-gray-400 shadow-primary/30 hover:shadow-lg hover:shadow-primary/40"
            >
              {isLoading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-on-surface-secondary">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); setInfoMessage(''); }} className="font-medium text-primary-focus hover:text-amber-600 ml-1">
            {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
