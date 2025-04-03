import React, { useContext, useEffect, useState } from 'react'
import SettingsTable from './SettingsTable.js';
import {SettingCards} from "./SettingCards.js"
import { URL } from '../../libs/Constants.js';
import fakeCardData from '../../data/fakeCardData.json'
import { MainContext } from '../../context/MainContext.js';
import { Link } from 'react-router-dom';

const Settings = () => {

  const {isLogin, isDemo} = useContext(MainContext)
  const [tableData, setTableData] = useState([]) // to store table data coming from the circuit
  const [deviceTotal, setDeviceTotal] = useState()
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    if (isDemo) {
      setTableData(fakeCardData);
    } else {
      setTableData([]);
      const settingsSocket = new WebSocket(`${URL}/ws`)

      settingsSocket.onopen = () => {
        console.log("Connected to Settings WebSocket Server!");
        settingsSocket.send(JSON.stringify({ GETCARD: 1 })); // Send initial message
      };

      settingsSocket.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          const cardData = Object.values(rawData.settingparameter)
          if (cardData) {
            console.log("Received Card Data:", cardData);
            setTableData((prevData) => {
                const updated = [...prevData]
                cardData.forEach((newDevice) => {
                const existing = updated.findIndex((device) => device.nodeId === newDevice.nodeId)
                if(existing !== -1) {
                  const existingDevice = updated[existing];
                  
                  const hasChanged = Object.keys(newDevice).some(
                    (key) => newDevice[key] !== existingDevice[key]
                  );

                  if (hasChanged) {
                    updated[existing] = newDevice; // update only if there are changes
                  }
                } else {
                  updated.push(newDevice)
                }
              })
              return updated
            })
          }
        } catch (error) {
          console.error("Error parsing Settings WebSocket message:", error);
        }
      }

      settingsSocket.onclose = () => {
        console.log("Settings WebSocket Disconnected.");
      };
      setSocket(settingsSocket);

      // cleanup WebSocket connection on unmount
      return () => {
        settingsSocket.close();
      };
    }
  }, []);
  

  return (
    <>
      {isLogin && (
      <div className='page'>
        <div className='st-head flex-space-row'> 
            <SettingCards tableData={tableData}/>
          <div className='st-udtd-dv'>
              Update/Remove Devices
          </div>
        </div>
       
        <SettingsTable tableData={tableData} settingsSocket={socket} />
       
      </div>
  )}
      {!isLogin && (
        <div className='sttngs-user'>
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27 17.4V27M27 36.6H27.024M51 27C51 40.2548 40.2548 51 27 51C13.7452 51 3 40.2548 3 27C3 13.7452 13.7452 3 27 3C40.2548 3 51 13.7452 51 27Z" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>You need to be logged in to access settings.</h2>
          <Link to='/login'>Login</Link>
        </div>
      )}
    </>
  )
}

export default Settings
