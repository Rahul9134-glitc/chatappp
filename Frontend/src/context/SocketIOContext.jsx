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
        
        // ----------------------------------------------------
        // ✅ FIX: डायनामिक URL सेट करें
        // यह लोकल (http) और लाइव (https) दोनों जगह काम करेगा।
        // ----------------------------------------------------
        const protocol = window.location.protocol;
        const host = window.location.host;
        
        // यदि आपका फ्रंटएंड और बैकएंड एक ही डोमेन पर है (जैसा कि Render पर है),
        // तो हम वर्तमान URL का उपयोग कर सकते हैं।
        const BACKEND_URL = `${protocol}//${host}`; 

        const newSocket = io(BACKEND_URL, { // <--- URL बदला गया
          query: {
            userId: auth.data._id,
          },
          transports: ["websocket"] // ✅ FIX: Render प्रॉक्सी के लिए इसे जोड़ें
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