import React, { useContext, useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import AlertLedger from '../../components/AlertLedger/AlertLedger';
import AlertTray from '../../components/AlertTray/AlertTray';
import StatusDeckGlance from '../../components/StatusDeckGlance/StatusDeckGlance';
import { BatteryChart, SmokeChart, TempChart } from '../../components/Charts/Charts';
import fakeCardData from '../../data/fakeCardData.json';
import DeckView from '../../components/DeckView/DeckView';
import DemoButton from '../../components/DemoButton/DemoButton';
import { MainContext } from '../../context/MainContext';
import { URL } from '../../libs/Constants';
import { RECONNECT_INTERVAL } from '../../libs/Constants';
import {motion} from 'motion/react'

const MAX_RECONNECT_ATTEMPTS = 20;
const POLLING_INTERVAL = 10000; // 10 seconds

const Dashboard = () => {
  const { sendMessage ,isDemo, socketRef, data,setData} = useContext(MainContext);
  
  const reconnectAttempts = useRef(0);
  const pollingRef = useRef(null);

  useEffect(()=>{
    console.log('data changed in dashboard',data)
  },[data])


  useEffect(() => {
    if (!isDemo) {
      setData([]);
      sendMessage({ GETCARD: 1 });
      startPolling();
    } else {
      setData(fakeCardData);
      stopPolling()
    }
     return () => stopPolling();
  }, [isDemo]);

  useEffect(() => {
    if (isDemo || !socketRef.current) return; // Only proceed if not in demo mode
  
    const handleMessage = (event) => {
      try {
        let cardData = JSON.parse(event.data);
        console.log("Received data:", cardData);
  
        if (!Array.isArray(cardData)) {
          cardData = [cardData];
        }
  
        // Update state with new card data
        setData((prevData) => {
          const updated = [...prevData];
          cardData.forEach((newDevice) => {
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
  
    // Listen for incoming messages
    socketRef.current.addEventListener("message", handleMessage);
  
    return () => {
      // Cleanup listener
      socketRef.current.removeEventListener("message", handleMessage);
    };
  }, [isDemo, socketRef]); // Added isDemo as a dependency

  
  

  const updateCard = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending UPDATEDATA request...');
      socketRef.current.send(JSON.stringify({ "UPDATEDATA": 1 }));
    } else {
      console.warn("WebSocket not connected");
    }
  };

  const startPolling = () => {
    stopPolling(); // Prevent duplicate intervals
    console.log("Attempting to start polling...");
  
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not open, delaying polling start...");
      setTimeout(startPolling, 2000); // Retry in 2 seconds
      return;
    }
  
    console.log("Starting polling for UPDATEDATA every 10 seconds...");
    pollingRef.current = setInterval(updateCard, POLLING_INTERVAL);
  };
  
  const stopPolling = () => {
    if (pollingRef.current) {
      console.log("Stopping polling...");
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  return (
    <div className='page'>
      <div className='width-100 flex-space-row'>
        <div className='db-secondary flex-start-col'>
          <DemoButton />
          <StatusDeckGlance data={data} />
          <TempChart data={data} />
          <BatteryChart data={data} />
          <SmokeChart data={data} />
        </div>

        <div className='flex-start-col db-primary'>
          <AlertLedger />
          <AlertTray socket={socketRef.current} data={data} />
          <DeckView data={data}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
