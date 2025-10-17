import { createContext, use, useEffect, useRef, useState } from "react";
import { FIRE_TEMP, RECONNECT_INTERVAL, URL } from "../libs/Constants";
import fakeCardData from "../data/fakeCardData.json";

const MainContext = createContext();

const MAX_RECONNECT_ATTEMPTS = 15;

const MainContextProvider = (props) => {
  const [data, setData] = useState([]);
  const [deviceLogs, setDeviceLogs] = useState({});
  const [weeklyLogs,setWeeklyLogs] = useState({});

  const [connectedState, setConnectedState] = useState("connecting");
  const [isDemo, setIsDemo] = useState(false);
  const [isLogin,setIsLogin] = useState(true)
  const [viewToggle,setViewToggle] = useState("all");
  const [fireNodes,setFireNodes] = useState([]);
  const [smokeNodes,setSmokeNodes] = useState([]);
  const [fallenNodes, setFallenNodes] = useState([]);

  const [isMuteAllEnabled, setIsMuteAllEnabled] = useState(false);
  
  const lastSeenRef = useRef(new Map());

  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    if (!isDemo) {
      setData([]);
      connectWebSocket();
      lastSeenRef.current.clear()
    }
    else{
      setData(fakeCardData);
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


    socket.onmessage = (event) => {
      console.log("event :",event)
      try {
        let newData = JSON.parse(event.data);
        console.log("[data]Received WebSocket data:", newData);

        if (newData.isAlarmStatus !== undefined) {
          console.log("[alarm]Received alarm status update:", newData.isAlarmStatus);
          setIsMuteAllEnabled(Boolean(newData.isAlarmStatus));
          return;
        }

        if(newData[0]?.isPast){
          console.log("[logs]Received weekly log data:", newData);
          setWeeklyLogs(newData);
          return;
        }

        if (newData[0]?.isDeviceLog) {
          const deviceLog = newData[0];
          console.log("[logs]Received device log data:", deviceLog);
          setDeviceLogs(prev => ({
            ...prev,
            [deviceLog.nodeId]: deviceLog
          }));
          return;
        }

        if (!Array.isArray(newData)) {
          newData = [newData];
        }

        
      
        setData((prevData) => {
          const updated = [...prevData];
          newData.forEach((newDevice) => {
            const id = String(newDevice.nodeId);
            const existingIndex = updated.findIndex((device) => device.nodeId === newDevice.nodeId);
            if (existingIndex !== -1) {
              const existingDevice = updated[existingIndex];
              const hasChanged = Object.keys(newDevice).some(
                (key) => newDevice[key] !== existingDevice[key]
              );
              if (hasChanged) {
                console.log(`[data] Updating device ${id}`);
                updated[existingIndex] = newDevice;

                lastSeenRef.current.set(id, Date.now());
                console.log(`[lastSeenRef] Updated ${id} at ${new Date().toLocaleTimeString()}`);
                
              }
            } else {
              console.log(`[data] Adding new device ${id}`);
              updated.push(newDevice);

              lastSeenRef.current.set(id, Date.now());
              console.log(`[lastSeenRef] Added ${id} at ${new Date().toLocaleTimeString()}`);
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
      console.log("Sending message to dashboard socket:", JSON.stringify(message));
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected");
    }
  };
 
  useEffect(() => {
    if(!isDemo) {
      console.log('updated data in maincontext', data);
  
    setFireNodes((prev) => {
      const existingIds = new Set(prev.map((d) => d.nodeId));
      const newFireNodes = data.filter((device) => {
        const isTemperatureHigh = device.tempvalue >= FIRE_TEMP;
        return isTemperatureHigh && !existingIds.has(device.nodeId);
      });
      return [...prev, ...newFireNodes];
    });
  
    setSmokeNodes((prev) => {
      const fireNodeIds = new Set(
        data
          .filter((device) => device.tempvalue >= FIRE_TEMP)
          .map((device) => device.nodeId)
      );
      const existingIds = new Set(prev.map((d) => d.nodeId));
      const newSmokeNodes = data.filter((device) => {
        const hasSmoke = device.status?.includes('smoke');
        const isInFireNodes = fireNodeIds.has(device.nodeId);
        return hasSmoke && !isInFireNodes && !existingIds.has(device.nodeId);
      });
      return [...prev, ...newSmokeNodes];
    });

    setFallenNodes((prev) => {
      const existingIds = new Set(prev.map((d) => d.nodeId));
      const newFallenNodes = data.filter((device) => {
        return device.statusCode === 2 && !existingIds.has(device.nodeId);
      });
      return [...prev, ...newFallenNodes];
    });
    }
    
  }, [data]);

   //Function that checks which devices are dead if we havent recieved data from them
   useEffect(() => {
    if (isDemo) return;
  
    const interval = setInterval(() => {
      const now = Date.now();
      console.log("=== Checking for dead devices ===");
  
      setData((prevData) => {
        return prevData.map((device) => {
          const id = String(device.nodeId);
          const lastSeen = lastSeenRef.current.get(id);
  
          let timeout = 50000;
          if (device.nodeType === "Repeater" || device.nodeType === "Suppressor") {
            timeout = 120000;
          }
  
          const secondsAgo = lastSeen ? Math.floor((now - lastSeen) / 1000) : "never";
          console.log(
            `[check] Device ${id} (${device.nodeType}) last seen: ${secondsAgo}s ago (timeout=${timeout / 1000}s)`
          );
  
          if (!lastSeen || now - lastSeen > timeout) {
            if (device.statusCode !== 0) {
              console.warn(`[mark-dead] Device ${id} marked dead`);
              return { ...device, statusCode: 0 };
            }
          } else if (device.statusCode === 0) {
            console.info(`[revive] Device ${id} is alive again`);
            return { ...device, statusCode: 1 };
          }
  
          return device;
        });
      });
    }, 5000);
  
    return () => clearInterval(interval);
  }, [isDemo]);
  

  useEffect(()=>{
    console.log('fire nodes updated',fireNodes)    
  },[fireNodes])

  useEffect(() => {
    console.log('smoke nodes updated',smokeNodes)
  },[smokeNodes])

  useEffect(() => {
    console.log("fallen nodes updated", fallenNodes);
  }, [fallenNodes]);  

  return (
    <MainContext.Provider
      value={{
        socketRef,
        sendMessage,
        connectedState,
        data,
        setData,  // Allow components to update the card data
        isDemo,
        deviceLogs, 
        setIsDemo,
        isLogin,
        setIsLogin,
        viewToggle,
        setViewToggle,
        fireNodes,
        setFireNodes,
        smokeNodes,
        setSmokeNodes,
        fallenNodes,
        setFallenNodes,
        isMuteAllEnabled,
        setIsMuteAllEnabled,
        weeklyLogs,
        setWeeklyLogs
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export { MainContext, MainContextProvider };
