import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createNewUser } from '../lib/userService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Alert } from '../ui/alert';

export function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    rol: 'modelista'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2. Guardar información adicional en Firestore
      await createNewUser(userCredential.user.uid, {
        email: formData.email,
        nombre: formData.nombre,
        rol: formData.rol,
      });

      // 3. Redirigir al login
      navigate('/login');
    } catch (err) {
      console.error('Error al registrar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">Registro de Usuario</h2>
      
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Completo</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rol">Tipo de Usuario</Label>
          <Select 
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="modelista">Modelista</option>
            <option value="lider">Líder</option>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <a
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Iniciar Sesión
        </a>
      </p>
    </div>
  );
}