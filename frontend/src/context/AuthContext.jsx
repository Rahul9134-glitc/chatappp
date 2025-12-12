import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("chatapp")) || null);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("chatapp", JSON.stringify(auth));
    } else {
      localStorage.removeItem("chatapp");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
