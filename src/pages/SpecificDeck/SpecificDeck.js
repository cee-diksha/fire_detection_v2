import React, { useContext, useEffect, useRef, useState } from 'react'
import NodeInfo from '../../components/NodeInfo/NodeInfo'
import { useParams } from 'react-router-dom';
import fakeCardData from '../../data/fakeCardData.json'
import { MainContext } from '../../context/MainContext';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import './SpecificDeck.css'

const MAX_RECONNECT_ATTEMPTS = 15

const SpecificDeck = () => {
  const { deck} = useParams();
  const { sendMessage, socketRef , isDemo, viewToggle} = useContext(MainContext)

  const [device,setDevice] = useState({"deckno":deck,"location":"Not set yet"})
    
  const [devices, setDevices] = useState([]);

    useEffect(() => {
            if (!isDemo) {
                setDevices([]);
    
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    console.log("Sending DECK request:", { deckno: deck });
                    sendMessage({ "DECK": { "deckno":deck} });
                } else {
                    console.warn("WebSocket not connected yet. Waiting...");
                }
            } else {
                const filteredData = fakeCardData.filter(item =>
                    item.deckno.toString() === deck.toString()
                );
                setDevices(filteredData);
            }
      }, [deck, isDemo, socketRef]);

      useEffect(() => {
              if (isDemo || !socketRef.current) return;
          
              const handleMessage = (event) => {
                  try {
                      let response = JSON.parse(event.data);
                      console.log("Received data:", response);
          
                      if (!Array.isArray(response)) {
                          response = [response]; // Ensure response is always an array
                      }
          
                      // Filter devices based on deck and comp params
                      const filteredDevices = response.filter(
                          (device) => 
                              device.deckno.toString() === deck.toString()
                      );
          
                      if (filteredDevices.length === 0) {
                          console.warn("No matching devices found for the given deck and comp.");
                          return;
                      }
          
                      setDevices((prevDevices) => {
                          const updatedDevices = [...prevDevices];
          
                          filteredDevices.forEach((newDevice) => {
                              const existingIndex = updatedDevices.findIndex(
                                  (device) => device.nodeId === newDevice.nodeId
                              );
          
                              if (existingIndex !== -1) {
                                  const existingDevice = updatedDevices[existingIndex];
          
                                  // Check if any field has changed
                                  const hasChanged = Object.keys(newDevice).some(
                                      (key) => newDevice[key] !== existingDevice[key]
                                  );
          
                                  if (hasChanged) {
                                      updatedDevices[existingIndex] = newDevice;
                                  }
                              } else {
                                  updatedDevices.push(newDevice);
                              }
                          });
          
                          return updatedDevices;
                      });
                  } catch (error) {
                      console.error("Error parsing WebSocket message:", error);
                  }
              };
          
              socketRef.current.addEventListener("message", handleMessage);
          
              return () => {
                  socketRef.current.removeEventListener("message", handleMessage);
              };
          }, [isDemo, socketRef, deck]);



      const refreshCard = (event, nodeId) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("Refreshing Node", nodeId);
        
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ "REFRESH": nodeId }));
        } else {
            console.warn("WebSocket not connected, cannot send REFRESH command.");
        }
      };

  return (
    <div className='page'>
      <NodeInfo device={device} isDeck={true}/>
      <section className='sp-d-sec'>
        <h3 className='sp-d-head'>Online devices</h3>
        <div className='specific-deck-tray'>
        {devices.filter((device) => device.statusCode === 1).length > 0 ? (
              devices
                  .filter((device) => device.statusCode === 1) // Only show devices with statusCode 1
                  .map((item, index) => (
                      <DeviceCard key={`Comp-specific-crd-${index}`} {...item} refreshCard={refreshCard} />
                  ))
          ) : (
              <p>No devices found.</p>
          )}     
          </div>   
      </section>
      <section className='sp-d-sec'>
        <h3 className='sp-d-head'>Offline devices</h3>
        <div className='specific-deck-tray'>
        {devices.filter((device) => device.statusCode === 0).length > 0 ? (
              devices
                  .filter((device) => device.statusCode === 0) // Only show devices with statusCode 1
                  .map((item, index) => (
                      <DeviceCard key={`Comp-specific-crd-${index}`} {...item} refreshCard={refreshCard} />
                  ))
          ) : (
              <p>No offline devices.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default SpecificDeck