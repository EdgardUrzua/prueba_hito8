import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Guarda el token en localStorage
  const [email, setEmail] = useState(localStorage.getItem('email') || null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {  // Si la respuesta no es OK, lanzar un error
        throw new Error('Credenciales incorrectas o error al iniciar sesión');
      }
      
      const data = await response.json();
      if (!data.token) {
        throw new Error('No se ha recibido un token válido');
      }

      setToken(data.token);
      setEmail(data.email);
      localStorage.setItem('token', data.token);  // Guarda el token en localStorage
      localStorage.setItem('email', data.email);
      return true; // Indica que el login fue exitoso
    } catch (error) {
      console.error(error);
      return false; // Indica que el login falló
    }
  };

  const register = async (email, password) => {
    try {
      console.log('Datos enviados al backend:', { email, password }); 
  
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {  // Si la respuesta no es OK, lanzar un error
        const errorData = await response.json();  //mensaje de error del backend
        console.error('Error de registro:', errorData.error);  // Imprimir el error en consola
        throw new Error(errorData.error || 'Error al registrarse');
      }
  
      const data = await response.json();
      if (!data.token) {
        throw new Error('No se ha recibido un token válido');
      }
  
      setToken(data.token);
      setEmail(data.email);
      localStorage.setItem('token', data.token); 
      localStorage.setItem('email', data.email);
      return true;  // Indica que el registro fue exitoso
    } catch (error) {
      console.error(error);
      return false;  // Indica que el registro falló
    }
  };
  

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const getProfile = async () => {
    try {
      if (!token) {
        throw new Error('Token no válido o no presente');
      }

      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Error al obtener el perfil');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null; 
    }
  };

  return (
    <UserContext.Provider value={{ token, email, login, register, logout, getProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
