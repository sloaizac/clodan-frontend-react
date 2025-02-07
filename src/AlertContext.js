/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import Alert from '@mui/material/Alert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [session, setSession] = useState(null);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const logout = () => {
    localStorage.removeItem('session');
    setSession(null);
    window.location.pathname = '/login';
  };

  return (
    <AlertContext.Provider value={{ showAlert, logout, session, setSession }}>
      <div className="relative">
        {children}
        {alert && (
          <Alert sx={{ mb: 5, mt: 2 }} severity={alert.type || 'info'}>
            {alert.message}
          </Alert>
        )}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
