import React, { useContext, useEffect, useRef, useState } from 'react';
import SettingsTable from './SettingsTable.js';
import { SettingCards } from './SettingCards.js';
import { URL } from '../../libs/Constants.js';
import fakeCardData from '../../data/fakeCardData.json';
import { MainContext } from '../../context/MainContext.js';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { isLogin, isDemo } = useContext(MainContext);

  const [filter, setFilter] = useState("all");
  const [filteredData, setFilteredData] = useState([]);

  // Use state to trigger re-renders on updates
  const [tableData, setTableData] = useState([]);
  const [newDevices, setNewDevices] = useState([]);

  // Use refs for values that don't need to trigger re-renders
  const initialLoadDoneRef = useRef(false);
  const postInitialTimerStartedRef = useRef(false);
  const socketRef = useRef(null);
  const processedMessagesRef = useRef(new Set());
  const reconnectAttemptsRef = useRef(0);
  const RECONNECT_INTERVAL = 5000; // Match MainContext.js
  const MAX_RECONNECT_ATTEMPTS = 15; // Match MainContext.js

  useEffect(() => {
    if (isDemo) {
      console.log('[settings] Demo mode: Using fakeCardData');
      setTableData(fakeCardData);
      initialLoadDoneRef.current = true;
      return;
    }

    console.log('[settings] Initializing WebSocket');
    connectWebSocket();

    return () => {
      console.log('[settings] Cleaning up WebSocket and timer');
      cleanUpWebSocket();
    };
  }, [isDemo]);

  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('[settings] Already connected, skipping reconnection.');
      return;
    }

    cleanUpWebSocket();
    console.log('[settings] Connecting to Settings WebSocket Server');

    const socket = new WebSocket(`${URL}/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[settings] Connected to Settings WebSocket Server');
      reconnectAttemptsRef.current = 0;
      socket.send(JSON.stringify({ GETCARD: 1 }));
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        const messageId = JSON.stringify(messageData);
        if (processedMessagesRef.current.has(messageId)) {
          console.log('[settings] Skipping duplicate message:', messageData);
          return;
        }
        processedMessagesRef.current.add(messageId);

        console.log('[settings] Received WebSocket data:', messageData);

        // Handle save or delete confirmations
        if (messageData.save || messageData.remove || messageData.deleteall) {
          console.log('[settings] Received confirmation message, not updating newDevices:', messageData);
          return;
        }

        const cardData = Array.isArray(messageData.settingparameter)
          ? messageData.settingparameter
          : Object.values(messageData.settingparameter || {});
        if (!cardData.length) {
          console.log('[settings] No card data in message');
          return;
        }

        setTableData((prevTableData) => {
          const updated = [...prevTableData];
          const newOnes = [];

          cardData.forEach((newDevice) => {
            if (!newDevice.nodeId) {
              console.warn('[settings] Device missing nodeId:', newDevice);
              return;
            }

            const existingIndex = updated.findIndex(
              (device) => device.nodeId === newDevice.nodeId
            );

            if (existingIndex !== -1) {
              const existingDevice = updated[existingIndex];
              const hasChanged = Object.keys(newDevice).some(
                (key) => newDevice[key] !== existingDevice[key]
              );
              if (hasChanged) {
                console.log(`[settings] Updating existing device: ${newDevice.nodeId}`);
                updated[existingIndex] = newDevice;
              }
            } else {
              console.log(`[settings] Adding new device: ${newDevice.nodeId}`);
              updated.push(newDevice);
              if (initialLoadDoneRef.current && postInitialTimerStartedRef.current) {
                console.log(`[settings] Marking as new device: ${newDevice.nodeId}`);
                newOnes.push(newDevice.nodeId);
              } else {
                console.log(`[settings] Device ${newDevice.nodeId} added during initial load or timer period`);
              }
            }
          });

          if (newOnes.length > 0) {
            console.log('[settings] Updating newDevices:', newOnes);
            setNewDevices((prev) => [...new Set([...prev, ...newOnes])]);
          }

          return updated;
        });

        if (!initialLoadDoneRef.current) {
          console.log('[settings] Initial load complete, starting 2-second timer');
          initialLoadDoneRef.current = true;
          const timer = setTimeout(() => {
            console.log('[settings] Post-initial 2-second timer done — new devices will be tracked');
            postInitialTimerStartedRef.current = true;
          }, 2000);
          // Store timer in ref to clean up later
          socketRef.current.timer = timer;
        }
      } catch (error) {
        console.error('[settings] Error parsing Settings WebSocket message:', error);
      }
    };

    socket.onclose = (event) => {
      console.log('[settings] WebSocket Disconnected.', event);
      if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        console.warn('[settings] WebSocket closed unexpectedly, attempting to reconnect...');
        reconnectAttemptsRef.current += 1;
        setTimeout(connectWebSocket, RECONNECT_INTERVAL);
      }
    };

    socket.onerror = (error) => {
      console.error('[settings] WebSocket Error:', error);
    };
  };

  const cleanUpWebSocket = () => {
    if (socketRef.current) {
      console.log('[settings] Cleaning up WebSocket connection');
      if (socketRef.current.timer) {
        clearTimeout(socketRef.current.timer);
      }
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
      socketRef.current.onerror = null;
      socketRef.current.close();
      socketRef.current = null;
      processedMessagesRef.current.clear();
    }
  };

  useEffect(() => {
    console.log('Table data or filter changed, applying filter:', filter);
    if (filter === "all") {
      setFilteredData(tableData);
    } else {
      console.log(tableData)
      setFilteredData(tableData.filter(d => d?.nodeType?.toLowerCase() === filter));
    }
  }, [tableData, filter]);

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  return (
    <>
      {isLogin ? (
        <div className="page">
          <div className="st-head flex-space-row">
            <SettingCards tableData={tableData} onFilterChange={handleFilterChange} selectedFilter={filter} />
            <div className="st-udtd-dv">Update/Remove Devices</div>
          </div>

          <SettingsTable
            tableData={filteredData}
            settingsSocket={socketRef.current}
            newDevices={newDevices}
            setNewDevices={setNewDevices}
            setTableData={setTableData}
          />
        </div>
      ) : (
        <div className="sttngs-user">
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27 17.4V27M27 36.6H27.024M51 27C51 40.2548 40.2548 51 27 51C13.7452 51 3 40.2548 3 27C3 13.7452 13.7452 3 27 3C40.2548 3 51 13.7452 51 27Z"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2>You need to be logged in to access settings.</h2>
          <Link to="/login">Login</Link>
        </div>
      )}
    </>
  );
};

export default Settings;