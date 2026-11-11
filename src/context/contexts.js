import { createContext } from 'react';

// Separados de los Providers para que Fast Refresh funcione en esos archivos.
export const AuthContext = createContext();
export const ThemeContext = createContext();
