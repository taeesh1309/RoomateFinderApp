import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [currentTab, setCurrentTab] = useState("");

  return (
    <UserContext.Provider
      value={{ userId, setUserId, currentTab, setCurrentTab }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
