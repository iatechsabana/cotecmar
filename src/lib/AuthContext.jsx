import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getUser, createNewUser, ROLES } from './userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setLoading(true);
    setError(null);
    
    // Suscribirse a cambios de auth en Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Si hay usuario autenticado, intentar obtener su perfil
          let profile = null;
          try {
            profile = await getUser(firebaseUser.uid);
          } catch (err) {
            console.warn('Error al obtener perfil, usando datos básicos:', err);
            profile = {
              rol: ROLES.PENDIENTE,
              offline: true
            };
          }
          
          // Si no existe el perfil o está en modo offline, intentar crear uno nuevo
          if (!profile || profile.offline) {
            try {
              // Crear nuevo usuario con rol de modelista directamente
              await createNewUser(firebaseUser.uid, {
                email: firebaseUser.email,
                nombre: firebaseUser.displayName || firebaseUser.email,
                rol: ROLES.MODELISTA, // Asignar rol de modelista automáticamente
              });
              profile = await getUser(firebaseUser.uid);
            } catch (err) {
              console.warn('Error al crear perfil nuevo:', err);
              // Mantener el perfil offline si falla la creación
            }
          } else if (profile.rol === ROLES.PENDIENTE) {
            // Si el usuario existe pero tiene rol pendiente, actualizarlo a modelista
            try {
              await updateUserRole(firebaseUser.uid, ROLES.MODELISTA);
              profile = await getUser(firebaseUser.uid);
            } catch (err) {
              console.warn('Error al actualizar rol:', err);
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            nombre: profile?.nombre || firebaseUser.displayName || firebaseUser.email,
            rol: profile?.rol || ROLES.PENDIENTE,
            offline: profile?.offline || false
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error al cargar el perfil:', err);
        // Si es un error de conexión, intentar usar datos en caché
        if (err.code === 'failed-precondition' || err.code === 'unavailable') {
          // Mantener el usuario actual si existe
          setError('Problemas de conexión. Algunas funciones pueden estar limitadas.');
        } else {
          setUser(null);
          setError('Error al cargar el perfil de usuario.');
        }
      } finally {
        setLoading(false);
      }
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isLider: user?.rol === 'lider',
    isModelista: user?.rol === 'modelista',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}