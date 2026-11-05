import { useEffect, useState } from 'react';

// Carga datos con una función de los servicios y expone los tres estados de la pantalla.
// La clave identifica a cada carga: el loading sale de comparar claves, y una respuesta
// vieja no puede pisar a una más nueva.
export const useFetch = (fetchFunction, dependencies = []) => {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState({ clave: null, data: null, error: null });
  const clave = JSON.stringify([dependencies, intento]);

  useEffect(() => {
    let activo = true;

    fetchFunction()
      .then((data) => {
        if (activo) setResultado({ clave, data, error: null });
      })
      .catch((error) => {
        if (activo) setResultado({ clave, data: null, error });
      });

    return () => {
      activo = false;
    };
    // fetchFunction cambia en cada render; lo que decide si recargar son las dependencias
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  const listo = resultado.clave === clave;

  return {
    data: listo ? resultado.data : null,
    error: listo ? resultado.error : null,
    loading: !listo,
    recargar: () => setIntento((n) => n + 1),
  };
};
