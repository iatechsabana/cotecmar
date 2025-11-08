import { useState } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createNewUser } from '../lib/userService';
import { X } from 'lucide-react';
import { Label } from '../ui/label';
import { Alert } from '../ui/alert';
import { toast } from '../ui/use-toast';

export function RegisterModal({ isOpen, onClose }) {
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
    // console.log('Input changed:', name, value); // descomenta si quieres debug
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Normalizar + validaciones
    const email = (formData.email || '').trim();
    const nombre = (formData.nombre || '').trim();
    const password = formData.password || '';
    const confirm = formData.confirmPassword || '';
    const rol = formData.rol || '';

    if (!email || !nombre || !password || !confirm || !rol) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo válido.');
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      let saved;
      try {
        saved = await createNewUser(userCredential.user.uid, {
          email: email,
          nombre: nombre,
          rol: rol,
        });
      } catch (writeErr) {
        console.error('Error al guardar perfil en Firestore:', writeErr);
        if (window.navigator.onLine) {
          try {
            await deleteUser(userCredential.user);
            console.warn('Usuario de Auth eliminado por fallo al guardar perfil en Firestore');
          } catch (delErr) {
            console.error('No se pudo eliminar el usuario de Auth tras fallo:', delErr);
          }
        }
        setError(writeErr.message || 'Error al crear perfil de usuario en la base de datos');
        setLoading(false);
        return;
      }

      if (saved && saved.pendingSync) {
        try {
          await deleteUser(userCredential.user);
          console.warn('Usuario de Auth eliminado debido a registro pendiente (offline)');
        } catch (delErr) {
          console.error('No se pudo eliminar el usuario de Auth tras pendiente:', delErr);
        }
        setError('No hay conexión. El registro no se completó en el servidor. Intenta nuevamente cuando tengas conexión.');
      } else if (saved && saved.id) {
        toast({ title: 'Registro exitoso', description: 'Ahora puedes iniciar sesión.' });
        onClose();
      } else {
        setError('Registro completado pero no se pudo verificar en el servidor.');
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      setError(err.message || 'Error desconocido al registrar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      // Overlay: asegúrate de que capture eventos y esté detrás del modal
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 pointer-events-auto"
      aria-modal="true"
      role="dialog"
    >
      <div
        // Contenedor del modal: asegurar pointer-events y z-index para que los inputs reciban eventos
        className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 relative animate-fadeIn mx-auto overflow-y-auto max-h-[90vh] pointer-events-auto z-50"
        // Evita que un posible onClick del overlay cierre o bloquee la interacción con los inputs
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors z-50"
          type="button"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-[#0f1e4d] mb-6">
          Registro de Usuario
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <input
              type="email"
              autoComplete="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <input
              type="text"
              autoComplete="name"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <input
              type="password"
              autoComplete="new-password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <input
              type="password"
              autoComplete="new-password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Tipo de Usuario</Label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full pl-3 pr-3 py-2 rounded-xl border border-[#b9c5ff]/70 bg-white/60 text-[#1a2b6f] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-all"
            >
              <option value="modelista">Modelista</option>
              <option value="lider">Líder</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1a2b6f] to-[#2a3c9f] text-white font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-6 relative"
          >
            <span className="relative z-10">
              {loading ? 'Registrando...' : 'Registrarse'}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </form>
      </div>
    </div>
  );
}
