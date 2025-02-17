import React, { useContext, useEffect, useState ,useRef} from 'react'
import './Dashboard.css'
import AlertLedger from '../../components/AlertLedger/AlertLedger'
import AlertTray from '../../components/AlertTray/AlertTray'
import StatusDeckGlance from '../../components/StatusDeckGlance/StatusDeckGlance'
import { BatteryChart, SmokeChart, TempChart } from '../../components/Charts/Charts'
import fakeCardData from '../../data/fakeCardData.json'
import noCardData from '../../data/noCardData.json'
import DeckView from '../../components/DeckView/DeckView'
import DemoButton from '../../components/DemoButton/DemoButton'
import { MainContext } from '../../context/MainContext'
import { URL } from '../../libs/Constants'

const Dashboard = () => {
  const [data, setData] = useState([])
  const {isDemo, setIsDemo} = useContext(MainContext)

  const socketRef = useRef(null);
  // const updateIntervalRef = useRef(null);

  useEffect(() => {
    if (isDemo === false) {
      setData([]);
      if (socketRef.current) {
        socketRef.current.close(); // Close any existing connection
      }

      const dashBoardSocket = new WebSocket("ws://192.168.43.121:1880/ws/dashboard");
      socketRef.current = dashBoardSocket;

      dashBoardSocket.onopen = () => {
        console.log("Connected to WebSocket Server!");
        dashBoardSocket.send(JSON.stringify({ GETCARD: 1 })); // Send initial request

        // Start sending UPDATE events every 10 seconds
        // updateIntervalRef.current = setInterval(() => {
        //   if (socketRef.current?.readyState === WebSocket.OPEN) {
        //     console.log("Sending UPDATE event");
        //     socketRef.current.send(JSON.stringify({ UPDATEDATA: 1 }));
        //   }
        // }, 10000);
      };

      dashBoardSocket.onmessage = (event) => {
        console.log(event, "event check");
        try {
          const cardData = JSON.parse(event.data);
          if (cardData) {
            console.log("Received Card Data:", cardData);
            setData((prevData) => {
              const updated = [...prevData];
              cardData.forEach((newDevice) => {
                const existing = updated.findIndex((device) => device.nodeId === newDevice.nodeId);
                if (existing !== -1) {
                  const existingDevice = updated[existing];

                  // Check if data has changed
                  const hasChanged = Object.keys(newDevice).some(
                    (key) => newDevice[key] !== existingDevice[key]
                  );

                  if (hasChanged) {
                    updated[existing] = newDevice; // Update only if there are changes
                  }
                } else {
                  updated.push(newDevice);
                }
              });
              return updated;
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      dashBoardSocket.onclose = (event) => {
        console.log("WebSocket Disconnected.", event);
        // clearInterval(updateIntervalRef.current); // Stop sending updates
        if (!event.wasClean) {
          console.warn("WebSocket closed unexpectedly, attempting to reconnect...");
          reconnectWebSocket();
        }
      };

      dashBoardSocket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      // Cleanup WebSocket connection on unmount
      return () => {
        dashBoardSocket.close();
        // clearInterval(updateIntervalRef.current); // Clear the interval on unmount
      };
    } else {
      setData(fakeCardData);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      // clearInterval(updateIntervalRef.current);
    }
  }, [isDemo]);

  const reconnectWebSocket = () => {
    setTimeout(() => {
      if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
        console.log("Reconnecting WebSocket...");
        setIsDemo(false)
      }
    }, 5000); // Wait 5 seconds before reconnecting
  };
  

  return (       
    <div className='page'>
    <div className='width-100 flex-space-row'>
      <div className='db-secondary flex-start-col'>
        <DemoButton/>
        <StatusDeckGlance data={data}/>
        <TempChart data={data}/> 
        <BatteryChart data={data}/>
        <SmokeChart data={data}/>       
      </div>

      <div className='flex-start-col db-primary'>
        {/* Alert ledger */}
        <AlertLedger/>
        <AlertTray socket={socketRef.current} data={data} />
        <DeckView/>
      </div>  
    </div>    
  </div>
  )
}

export default Dashboard;
