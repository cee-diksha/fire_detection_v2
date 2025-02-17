import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MainContext } from '../../context/MainContext';
import fakeCardData from '../../data/fakeCardData.json'
import { SpecificBattChart, SpecificTempChart } from '../../components/SpecificCharts/SpecificCharts';
import './SpecificDevice.css'

const SpecificDevice = () => {
    const {id} = useParams();
    const {isDemo} = useContext(MainContext);
    const device = fakeCardData.filter(item => item.nodeId.toString() === id)[0]
    console.log(device, "deviceeee")
    const alertlogstemp = device.alertlogstemp
    const alertlogsbattery = device.alertlogsbattery
    

    const [affectedDevices, setAffectedDevices] = useState([])

    return (
        <div className='page'>
        <div className='specific-top'>
            <div className='specific-header-location'>
            <h4 className="h4"> {device.location} - Deck: {device.deckno}, Compartment: {device.compno} </h4>
                <div className='specific-device-header'>
                    <h4 className="h4">{device.location}</h4> 
                </div>
            </div>
        </div>
             {/* <div className='indication-container'>
            {(!device.status.includes("success") || device.isDeleted !== false) && <div className='indication' style={{background: `${device.status.includes("danger") ? "var(--fire-alert)" : device.status.includes("orange") ? "var(--temp-alert)" : device.status.includes("yellow") ? "var(--battery-alert)" : device.isDeleted ? "var(--replace-alert)"  :  device.status.includes("smoke") ? "var(--smoke-alert)" : "#a391b8" }`,
                color: `${ (device.status.includes("danger") ||  device.status.includes("orange")) ? "#ffffff" : (device.status.includes("yellow") || device.status.includes("smoke") || device.isDeleted) ? "#ffffff" : "#ffffff"}`
            }}>
            {device.status.includes("danger") ? "Fire" : device.status.includes("orange") ? "Temp Rising" : device.status.includes("smoke") ? "Smoke" : device.status.includes("yellow") ? "Low Battery" : device.isDeleted ? "Needs Replacement" :  "Not Responding" }
            </div>}    
            </div> */}

        <div className='alerts-chart-wrapper flex-space-row width-100'>
            <div className='log-wrapper flex-start-col'>
                {(alertlogstemp !== null && alertlogstemp.length !== 0) && <div className='alert-logs'>
                    <h2 style={{color:"#ff7b7b"}}>Alert Logs - Temperature</h2>
                {alertlogstemp !== null && alertlogstemp.map(item => <div className='single-alert'>
                    <span className='alert-span'style={{fontWeight: "600"}}>{item.time} - </span>
                    <span className='alert-span'>{item.message}</span>
                </div>)}
                </div>}
                {(alertlogsbattery !== null  && alertlogsbattery.length !== 0) && <div className='alert-logs'>
                    <h2 style={{color:"#FFC648"}}>Alert Logs - Battery</h2>
                {alertlogsbattery !== null && alertlogsbattery.map(item => <div className='single-alert'>
                    <span className='alert-span'style={{fontWeight: "600"}}>{item.time} - </span>
                    <span className='alert-span'>{item.message}</span>
                </div>)}
                </div>}
            </div>
            <div className='specific-device-charts'>
                {device.nodeType === "Sensor" && <SpecificTempChart temperature = {alertlogstemp} status={device.status}/>}
                <SpecificBattChart batt = {alertlogsbattery} status={device.status}/>
            </div>   
        </div>
        {affectedDevices.length > 0  && <hr style={{color: "white", width: "96%"}}></hr>}
        </div>
    )
}
export default SpecificDevice
