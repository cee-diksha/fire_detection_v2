import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MainContext } from '../../context/MainContext';
import fakeCardData from '../../data/fakeCardData.json'
import { SpecificBattChart, SpecificTempChart } from '../../components/SpecificCharts/SpecificCharts';
import './SpecificDevice.css'
import { URL } from '../../libs/Constants';
import { RECONNECT_INTERVAL } from '../../libs/Constants';
import { getAlertAndStatusDisplay } from '../../utils/AlertAndStatusDisplay';
import NodeInfo from '../../components/NodeInfo/NodeInfo';

const SpecificDevice = () => {
    const {id} = useParams();
    const {isDemo} = useContext(MainContext);
    const [device,setDevice] = useState({})

    const socketRef = useRef(null);
    const [data, setData] = useState([]);

    const [alertLogsTemp, setAlertLogsTemp] = useState([])
    const [alertLogsBattery, setAlertLogsBattery] = useState([]);
    const [statusDisplay,setStatusDisplay] = useState([]);
    const [alertType,setAlertType] = useState('');
    const [background,setBackground] = useState('');
    

    const [affectedDevices, setAffectedDevices] = useState([]);

    useEffect(()=>{
      console.log('updating statusDisplay')
      const { statusDisplay,alertType } = getAlertAndStatusDisplay(device?.status || [], device?.tempvalue, device?.batp, device?.statusCode);
        setStatusDisplay(statusDisplay);
        setAlertType(alertType)
    },[device])

    useEffect(()=>{
      const background = alertType === "fire"?"var(--fire-alert)":alertType === "smoke"?"var(--smoke-alert)":alertType === "temprise"?"var(--temp-alert)":alertType === "lowbat"?"var(--battery-alert)":"var(--replace-alert)"
      setBackground(background)
    },[alertType])

    useEffect(() => {      
        if (Array.isArray(data)) {
            const foundDevice = data.find(device => device.nodeId.toString() === id);
            if(foundDevice){
                setDevice(foundDevice || {}); 
                setAlertLogsBattery(foundDevice.alertlogsbattery || [])
                setAlertLogsTemp(foundDevice.alertlogstemp || [])
            }
            
        } else {
            console.error("Data is not an array:", data); 
            setDevice({});
        }
    }, [data, id]);

    useEffect(() => {
        console.log("in demo mode:",isDemo)
        if (!isDemo) {
      
          if (socketRef.current) {
            socketRef.current.close(); // Close any existing connection
          }
          
          
          const dashBoardSocket = new WebSocket(`${URL}/ws/devicelog`);

          socketRef.current = dashBoardSocket;
    
          dashBoardSocket.onopen = () => {
            console.log("Connected to WebSocket Server!");
            dashBoardSocket.send(JSON.stringify({"GETDATA":1}));
          };

          dashBoardSocket.onmessage = (event) => {
            
            try {
              const socketData = JSON.parse(event.data);
              if (socketData) {
                
                setData(socketData["data"])
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
      
          // clearInterval(updateIntervalRef.current);
        }
      }, []);
    
    const reconnectWebSocket = () => {
        setTimeout(() => {
          if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
            console.log("Reconnecting WebSocket...");
          }
        }, RECONNECT_INTERVAL); // Wait 5 seconds before reconnecting
      };

    return (
        <div className='page'>
        {device && (
        <>
          <div className='specific-alert' style={{background: background}}>
              <h4>{statusDisplay[0]}</h4>
            </div>
          <NodeInfo device={device} isDevice={true}/>
          <div className='alerts-chart-wrapper flex-space-row width-100'>
              <div className='log-wrapper flex-start-col'>
                  {(alertLogsTemp !== null && alertLogsTemp.length !== 0) && <div className='alert-logs'>
                      <h2 style={{color:"#ff7b7b"}}>Alert Logs - Temperature</h2>
                  {alertLogsTemp !== null && alertLogsTemp.map(item => <div className='single-alert'>
                      <span className='alert-span'style={{fontWeight: "600"}}>{item.time} - </span>
                      <span className='alert-span'>{item.message}</span>
                  </div>)}
                  </div>}
                  {(alertLogsBattery !== null  && alertLogsBattery.length !== 0) && <div className='alert-logs'>
                      <h2 style={{color:"#FFC648"}}>Alert Logs - Battery</h2>
                  {alertLogsBattery !== null && alertLogsBattery.map(item => <div className='single-alert'>
                      <span className='alert-span'style={{fontWeight: "600"}}>{item.time} - </span>
                      <span className='alert-span'>{item.message}</span>
                  </div>)}
                  </div>}
              </div>
              <div className='specific-device-charts'>
                  {device.nodeType === "Sensor" && <SpecificTempChart temperature = {alertLogsTemp} status={device.status}/>}
                  <SpecificBattChart batt = {alertLogsBattery} status={device.status}/>
              </div>
        </div>
        {affectedDevices.length > 0  && <hr style={{color: "white", width: "96%"}}></hr>}
        </>
        )}
        
        </div>
    )
}
export default SpecificDevice
