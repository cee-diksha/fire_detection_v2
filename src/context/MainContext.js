import { createContext, useEffect, useRef, useState } from "react";
import { RECONNECT_INTERVAL, URL } from "../libs/Constants";

const MainContext = createContext();

const MAX_RECONNECT_ATTEMPTS = 15;

const MainContextProvider = (props) => {
  const [data, setData] = useState([]);
  const [connectedState, setConnectedState] = useState("connecting");
  const [isDemo, setIsDemo] = useState(true);
  const [isLogin,setIsLogin] = useState(true)

  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!isDemo) {
      connectWebSocket();
    }

    return () => cleanUpWebSocket();
  }, [isDemo]);

  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Already connected, skipping reconnection.");
      return;
    }

    cleanUpWebSocket();
    console.log("Connecting to WebSocket Server");

    const socket = new WebSocket(`${URL}/ws/dashboard`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket Server");
      setConnectedState("connected");
      reconnectAttempts.current = 0;

      // Send GETCARD: 1 when the socket is connected
      socket.send(JSON.stringify({ GETCARD: 1 }));
    };

    socket.onclose = (event) => {
      console.log("WebSocket Disconnected.", event);
      if (!event.wasClean && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        console.warn("WebSocket closed unexpectedly, attempting to reconnect...");
        setConnectedState("reconnecting");
        reconnectWebSocket();
      } else {
        setConnectedState("error");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setConnectedState("error");
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      try {
        let newData = JSON.parse(event.data);
        console.log("Received WebSocket data:", newData);

        if (!Array.isArray(newData)) {
          newData = [newData]; // Ensure it's always an array
        }

        setData((prevData) => {
          const updated = [...prevData];
          newData.forEach((newDevice) => {
            const existingIndex = updated.findIndex((device) => device.nodeId === newDevice.nodeId);
            if (existingIndex !== -1) {
              const existingDevice = updated[existingIndex];
              const hasChanged = Object.keys(newDevice).some(
                (key) => newDevice[key] !== existingDevice[key]
              );
              if (hasChanged) {
                updated[existingIndex] = newDevice;
              }
            } else {
              updated.push(newDevice);
            }
          });
          return updated;
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  };

  const cleanUpWebSocket = () => {
    if (socketRef.current) {
      console.log("Cleaning up WebSocket connection...");
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
      socketRef.current.onerror = null;
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const reconnectWebSocket = () => {
    reconnectAttempts.current += 1;
    console.log(`Reconnecting attempt ${reconnectAttempts.current}...`);
    setTimeout(connectWebSocket, RECONNECT_INTERVAL);
  };

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected");
    }
  };

  return (
    <MainContext.Provider
      value={{
        socketRef,
        sendMessage,
        connectedState,
        data,
        setData,  // Allow components to update the card data
        isDemo,
        setIsDemo,
        isLogin,
        setIsLogin
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export { MainContext, MainContextProvider };
