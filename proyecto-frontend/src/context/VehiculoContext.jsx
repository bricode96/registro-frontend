import { createContext } from 'react';

// Se crea el contexto con valores iniciales
export const VehiculoContext = createContext({
    vehiculos: [],
    loading: true,
    error: null,
});