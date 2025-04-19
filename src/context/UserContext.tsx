import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
}

const UserContext = createContext<UserContextType>({
  email: null,
  setEmail: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem("userEmail"));

  useEffect(() => {
    if (email) {
      localStorage.setItem("userEmail", email);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [email]);

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
