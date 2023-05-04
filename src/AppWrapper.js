import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { Error } from './pages/Error';
import { NotFound } from './pages/NotFound';
import { Access } from './pages/Access';

const AppWrapper = (props) => {
    let location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
      const token = "TODO" //localStorage.getItem('jwtToken');
      // proveri da li postoji token i da li je validan
      if (token && token.length > 0) {
        // ovde mozete dodati kod za proveru da li je token validan
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      window.scrollTo(0, 0);
    }, [location]);
  
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/access" element={<Access />} />
        {isLoggedIn ? (
          <Route path="*" element={<App />} />
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    );
  };

export default AppWrapper;
