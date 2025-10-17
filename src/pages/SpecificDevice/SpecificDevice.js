import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MainContext } from '../../context/MainContext';
import fakeCardData from '../../data/fakeCardData.json'
import { SpecificBattChart, SpecificTempChart } from '../../components/SpecificCharts/SpecificCharts';
import './SpecificDevice.css'
import { RECONNECT_INTERVAL } from '../../libs/Constants';
import { getAlertAndStatusDisplay } from '../../utils/AlertAndStatusDisplay';
import NodeInfo from '../../components/NodeInfo/NodeInfo';

const SpecificDevice = () => {
  const { id } = useParams();
  const { sendMessage, isDemo, socketRef, data, deviceLogs } = useContext(MainContext);

  const [device, setDevice] = useState({});

  const [alertLogsTemp, setAlertLogsTemp] = useState([]);
  const [alertLogsBattery, setAlertLogsBattery] = useState([]);
  const [statusDisplay, setStatusDisplay] = useState([]);
  const [alertType, setAlertType] = useState('');
  const [background, setBackground] = useState('');

  const [affectedDevices, setAffectedDevices] = useState([]);

  const convertToIndianTime = (utcTime) => {
    if (!utcTime) return "";
    try {
      const date = new Date(utcTime);
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    } catch (err) {
      console.error("Invalid time:", utcTime, err);
      return utcTime;
    }
  };

  useEffect(() => {
    sendMessage({ DEVICELOG: id });
  }, [id]);

  useEffect(() => {
    const { statusDisplay, alertType } = getAlertAndStatusDisplay(
      device?.status || [],
      device?.tempvalue,
      device?.batp,
      device?.statusCode
    );
    setStatusDisplay(statusDisplay);
    setAlertType(alertType);
  }, [device]);

  useEffect(() => {
    const bg =
      alertType === "fire"
        ? "var(--fire-alert)"
        : alertType === "smoke"
        ? "var(--smoke-alert)"
        : alertType === "temprise"
        ? "var(--temp-alert)"
        : alertType === "lowbat"
        ? "var(--battery-alert)":
        alertType === "normal"? "var(--normal)"
        : "var(--replace-alert)";
    setBackground(bg);
  }, [alertType]);

  useEffect(() => {
    if(!isDemo) {
      if (Array.isArray(data)) {
        const foundDevice = data.find(d => d.nodeId.toString() === id.toString());
        if (foundDevice) {
          setDevice(foundDevice);
        }
      }
    }
    else{
      const foundDevice = fakeCardData.find(d => d.nodeId.toString() === id.toString());
        if (foundDevice) {
          setDevice(foundDevice);
        }
    }
    
  }, [data, id,isDemo]);

  useEffect(() => {
    let logs;
  
    if (isDemo) {
      const demoData = fakeCardData.find(card => card.nodeId.toString() === id.toString());
      logs = demoData || null;
    } else {
      logs = deviceLogs[id]?.logs || null;
      console.log("logs in specificlogs", logs);
    }
  
    if (logs) {
      // 🧹 Filter out unwanted log entries
      const filteredBatteryLogs = (logs.alertlogsbattery || []).filter(
        log => !log.message.toLowerCase().includes("normal")
      );
  
      const filteredTempLogs = (logs.alertlogstemp || []).filter(
        log => !log.message.toLowerCase().includes("working fine")
      );
  
      // 🕓 Convert UTC → IST
      const convertedBatteryLogs = filteredBatteryLogs.map(log => ({
        ...log,
        time: convertToIndianTime(log.time),
      }));
  
      const convertedTempLogs = filteredTempLogs.map(log => ({
        ...log,
        time: convertToIndianTime(log.time),
      }));
  
      setAlertLogsBattery(convertedBatteryLogs);
      setAlertLogsTemp(convertedTempLogs);
    } else {
      setAlertLogsBattery([]);
      setAlertLogsTemp([]);
    }
  }, [deviceLogs, id, isDemo]);
  

  return (
    <div className='page'>
      {device && (
        <>
          <div className='specific-alert' style={{ background }}>
            <h4>{statusDisplay[0]}</h4>
          </div>

          <NodeInfo device={device} isDevice={true} />

          <div className='alerts-chart-wrapper flex-space-row width-100'>
            <div className='log-wrapper flex-start-col'>
              
                <div className='alert-logs'>
                  <h2 style={{ color: "#ff7b7b" }}>Critical Alert Logs - Temperature</h2>
                  {alertLogsTemp.length > 0 ?(
                  <div className='alert-logs-in'>
                  {alertLogsTemp.map((item, idx) => (
                    <div key={idx} className='single-alert'>
                      <span className='alert-span' style={{ fontWeight: "600" }}>
                        {item.time} -{" "}
                      </span>
                      <span className='alert-span'>{item.message}</span>
                    </div>
                  ))}
                  </div>
                  ):(
                    <span className='alert-span'>No critical temperature alerts recorded.</span>  
                  )}
                </div>
              
                <div className='alert-logs'>
                  <h2 style={{ color: "#FFC648" }}>Critical Alert Logs - Battery</h2>
                  {alertLogsBattery.length > 0 ?(
                  <div className='alert-logs-in'>
                  {alertLogsBattery.map((item, idx) => (
                    <div key={idx} className='single-alert'>
                      <span className='alert-span' style={{ fontWeight: "600" }}>
                        {item.time} -{" "}
                      </span>
                      <span className='alert-span'>{item.message}</span>
                    </div>
                  ))}
                  </div>
                  ):(
                    <span className='alert-span'>No critical battery alerts recorded.</span>
                  )}
                </div>
              
            </div>

            <div className='specific-device-charts'>
              {device.nodeType === "Sensor" && (
                <SpecificTempChart temperature={alertLogsTemp} status={device.status} />
              )}
              <SpecificBattChart batt={alertLogsBattery} status={device.status} />
            </div>
          </div>

          {affectedDevices.length > 0 && (
            <hr style={{ color: "white", width: "96%" }}></hr>
          )}
        </>
      )}
    </div>
  );
};

export default SpecificDevice;
