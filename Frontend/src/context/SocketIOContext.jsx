import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext();

export const UseSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.data?._id) {
      const newSocket = io("https://chatapp-8eh1.onrender.com", {
        query: {
          userId: auth.data._id,
        },
      });

      newSocket.on("getOnlineUser", (users) => {
        setOnline(users);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
