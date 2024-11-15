import React, { createContext, useState, useContext } from 'react';

const MatchesContext = createContext();

export const MatchesProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);

  return (
    <MatchesContext.Provider value={{ matches, setMatches }}>
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => useContext(MatchesContext);
