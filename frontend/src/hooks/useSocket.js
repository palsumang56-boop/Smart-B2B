// src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { token, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      // Connect to the backend with the auth token
      const newSocket = io('https://smart-b2b.onrender.com', {
        auth: { token }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token]);

  return socket;
};