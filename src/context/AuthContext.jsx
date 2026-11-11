import { useEffect, useState } from 'react';
import { registrarAlPerderSesion } from '../services/api';
import { cerrarSesion, iniciarSesion, obtenerPerfil, registrarse } from '../services/authService';
import { AuthContext } from './contexts';

// Usuario activo y sesión. Acá no hay ningún token: el JWT está en una cookie HttpOnly que
// JavaScript no puede leer, y si la sesión sigue valiendo lo decide siempre el backend.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Mensaje para la pantalla de login: sesión vencida o sin conexión al arrancar
  const [aviso, setAviso] = useState(null);

  useEffect(() => registrarAlPerderSesion((codigo) => {
    setUser(null);
    // TOKEN_AUSENTE es no haber iniciado sesión todavía: no hay nada que avisar
    if (codigo !== 'TOKEN_AUSENTE') setAviso('Tu sesión venció. Iniciá sesión de nuevo.');
  }), []);

  // Al abrir la app se le pregunta al backend si la cookie todavía sirve
  useEffect(() => {
    let activo = true;

    obtenerPerfil()
      .then((perfil) => {
        if (activo) setUser(perfil);
      })
      .catch((error) => {
        if (activo && error.tipo !== 'sesion') setAviso(error.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const cambiarUsuario = (usuario) => {
    setAviso(null);
    setUser(usuario);
  };

  const login = async (credenciales) => cambiarUsuario(await iniciarSesion(credenciales));

  const register = async (datos) => cambiarUsuario(await registrarse(datos));

  // Solo el backend puede borrar la cookie: si la request falla, la sesión sigue abierta
  const logout = async () => {
    await cerrarSesion();
    cambiarUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, aviso, login, register, logout, actualizarUsuario: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
