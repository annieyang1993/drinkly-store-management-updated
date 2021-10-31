import React, { useState, createContext } from 'react';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, loggedIn, setLoggedIn }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};