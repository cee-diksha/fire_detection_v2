import React, { useContext, useEffect, useState } from 'react'
import './DeviceCard.css';
import { Tooltip } from '@mui/material';
import {motion} from 'motion/react'
import MarkFault from '../Modals/MarkFault';
import { Link } from 'react-router-dom';
import { MainContext } from '../../context/MainContext';
import { getAlertAndStatusDisplay } from '../../utils/AlertAndStatusDisplay';
import SuppressorToggle from '../Modals/SuppressorToggle';

/**
 * 
 * @param {number} nodeid //node id of device
 * @param {string} nodeType //type of device R, S, SU.
 * @param {number} deckno // deck no.
 * @param {number} compno //compartment no.
 * @param {object} status //array of device status
 * @param {number} tempvalue //device temprature
 * @param {string} smoke //is detecting smoke or not. val "checked"/"unchecked"
 * @param {string} lastupdate //date time string
 * @param {number} statusCode //status of the device
 * @param {string} location //device location
 * @param {number} batp //device battery percentage
 * @param {string} supp //checks if the suppressor is on auto or manual
 * @param {function} refreshCard //function that refreshes card's data
 * 
 * @returns 
 */

//animation vars
const hover = {background:"rgba(255, 255, 255, 0.6)"}
const hover2 = {background:"rgba(255, 255, 255, 0.8)"}
const repeatTransition = {repeat:Infinity,duration:0.5} //tempvalue bat alarm


//main
const DeviceCard = ({
    nodeId = 0,
    nodeType = "",
    deckno = 0,
    compno = 0,
    status = [],
    tempvalue = 0,
    smoke = "unchecked",
    lastupdate = '0/0/0 00:00:00',
    statusCode = 0,
    location = "location",
    batp = 0,
    supp = "unchecked",
    refreshCard
  }) => {

    const {isDemo} = useContext(MainContext);

  const [isLowBattery,setIsLowBattery] = useState(false);
  const [statusDisplay,setStatusDisplay] = useState([])
  const [alertType,setAlertType] = useState("");

  const [hasSmoke,setHasSmoke] = useState(false);
  const [hasFire,setHasFire] = useState(false);
  const [hasRise,setHasRise] = useState(false);

  const [alarmOn,setAlarmOn] = useState(true);
  const [cardAlarm,setCardAlarm] = useState(false);

  const [tempColor, setTempColor] = useState("green");
  const [tempImg, setTempImg] = useState("temperature.svg");
  const [batColor, setBatColor] = useState("green");
  const [batImg, setBatImg] = useState("battery.svg");
  const [isFault, setIsFault] = useState(false);

  const [showSuppressor, setShowSuppressor] = useState(false);

  // Sets alertType based on status array, batp and tempvalue
  useEffect(() => {  
    const { alertType, statusDisplay, hasSmoke, hasFire, hasRise } = getAlertAndStatusDisplay(status, tempvalue, batp, statusCode);
    
    setAlertType(alertType);
    setStatusDisplay(statusDisplay);
    setHasSmoke(hasSmoke);
    setHasFire(hasFire);
    setHasRise(hasRise)
  }, [status, tempvalue, batp]); //updated whenever status, tempvalue or batp change

  //card alarm state based on fire and toggle alarm
  useEffect(()=>{
    //if alarm is muted turn card alarm on
    if(!alarmOn && (hasFire || hasRise || hasSmoke)){
      setCardAlarm(true)
    }

    //if alarm is unmuted turn card alarm off
    else if(alarmOn && (hasFire || hasRise || hasSmoke)){
      setCardAlarm(false)
    }
  },[alarmOn,hasFire])

  //handles tempvalue and battery styling
  useEffect(() => {
    if (tempvalue > 55) {
      setTempColor("red");
      setTempImg("temperature-high");
    } else {
      setTempColor("green");
      setTempImg("temperature");
    }

    if (batp < 10) {
      setBatColor("red");
      setBatImg("battery-low");
    } else if (batp < 40) {
      setBatColor("orange");
      setBatImg("battery-mid");
    } else {
      setBatColor("green");
      setBatImg("battery");
    }
  }, [tempvalue, batp]);

  const handleTouch = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  //logic to handle suppresor activation
  const handleSuppressor = (e)=>{
    handleTouch(e)
    setShowSuppressor(true)
    console.log('suppresor pressed')
  }

  //logic to handle marking faulty
  const handleMarkFaulty = (e)=>{
    handleTouch(e)
    setIsFault(true)
  }

  //logic to handle alarm
  const handleAlarmToggle = (e) =>{
    handleTouch(e)
    setAlarmOn(!alarmOn)
  }

  return (
    <Link to={`/info/${nodeId}`}>
    <motion.div className={`dv-crd-mn ${alertType}`}>

        <motion.div className='dv-crd-alert-border' animate={cardAlarm?{opacity:[0,1,0]}:{opacity:0}} transition={cardAlarm?repeatTransition:{}}/>

        {/* Device Status */}
        <div className="dv-crd-status">
          {statusDisplay.map((item,index)=>{
            return(
              <React.Fragment key={`${nodeId}-status-${index}`}>
                <p>{item}</p>
                {index !== statusDisplay.length - 1 && (
                  <img src="/static/images/seperator.svg" alt="" />
                )}  
              </React.Fragment>
            )
          })}
        </div>

        {/* Device Location and Suppressor Active-inactive Card */}
        <div className="dv-crd-lctn-wrapper">
            {/* Device image, type and id */}
            <div className='dv-crd-lctn-mn'>
                {/* Node id and type */}
                <div className='dv-crd-node-type-div'>
                  <div className='dv-img flex-start-row'>
                    <img src={`/static/images/device/${nodeType.toLowerCase()}.svg`} alt={nodeType} />
                  </div>
                  <div id='node-type-id' className='flex-start-col'>
                      <p id='dv-crd-light-txt'>{nodeType}</p>
                      <p id='node-id'>{nodeId}</p>
                  </div>
                </div>

                {/* Location */}
                <div id='node-location' className='flex-start-col'>
                  <h5>{location}</h5>
                  <section>
                    <div id="node-deck-comp" className='flex-start-row'>
                      <p id='dv-crd-light-txt'>Deck</p>
                      <p>{deckno}</p>
                    </div>
                    <div id="node-deck-comp" className='flex-start-row'>
                      <p id='dv-crd-light-txt'>Compartment</p>
                      <p>{compno}</p>
                    </div>
                    
                  </section>
                </div>
            </div>
            
            {/* Suppressor ON/OFF */}
            {alertType==="fire" && (
              <div className='dv-activate'>
                {/* If Suppression is Manual */}
                {supp === "unchecked" && (
                  <div className='dv-circle' onClick={handleSuppressor}>
                    <img src="/static/images/device/suppressor.svg" alt="" />
                    <div className='dv-circle-text'>
                      <p>Activate</p>
                    </div>
                  </div>
                )}
                {showSuppressor && <SuppressorToggle open={true} handleClose={setShowSuppressor}/>}

                {/* If Suppression is Auto */}
                {supp === "checked" && (
                  <div className='dv-circle active-auto'>
                    <img src="/static/images/device/suppressor-active.svg" alt="" />
                    <div className='dv-circle-text '>
                      <p>Auto Supress Activate</p>
                    </div>
                  </div>
                )}
                  
              </div>
            )}
        </div>

        {/* Main info Tray : Battery, Temprature, Smoke */}
        {alertType==="replace" && (
            <div className="dv-crd-info-tray" style={{justifyContent:nodeType.toLowerCase()!=='sensor'?'center':''}}>
            {nodeType.toLowerCase() === 'sensor' && 
              (
                <>
                  <div id="temp-info-card" className="dv-crd-info-crd">
                  <img  style={{filter:'grayscale(10)'}} src={`/static/images/${tempImg}.svg`} alt="" />
                    <span style={{ color:'grey' }}>{tempvalue}°C</span>
                  </div>
                  <motion.div id="smoke-info-card" className={`dv-crd-info-crd`}>
                    <img src="/static/images/smoke.svg" alt="" />
                  </motion.div>
                </>
              )
            }
            
            <div id="battery-info-card" className="dv-crd-info-crd">
              <img style={{filter:'grayscale(10)'}} src={`/static/images/${batImg}.svg`} alt=""/>
              <span style={{ color: "grey" }}>{batp}%</span>
            </div>

        </div>
        )}
        {alertType!=="replace" && (
            <div className="dv-crd-info-tray" style={{justifyContent:nodeType.toLowerCase()!=='sensor'?'center':''}}>
            {nodeType.toLowerCase() === 'sensor' && 
              (
                <>
                  <div id="temp-info-card" className="dv-crd-info-crd">
                  <img src={`/static/images/${tempImg}.svg`} alt="" />
                    <span className={`${tempColor!=="green"?"blink":""}`} style={{ color: tempColor }}>{tempvalue}°C</span>
                  </div>
                  <motion.div id="smoke-info-card" className={`dv-crd-info-crd ${hasSmoke?"blink":""}`}>
                    <img src="/static/images/smoke.svg" alt="" />
                  </motion.div>
                </>
              )
            }
            
            <div id="battery-info-card" className="dv-crd-info-crd">
              <img src={`/static/images/${batImg}.svg`} alt=""/>
              <span className={`${batColor!=="green"?"blink":""}`} style={{ color: batColor }}>{batp}%</span>
            </div>

        </div>
        )}
        

        {/* Refresh Faulty and Alarm button tray */}
        <div className="dv-crd-bttn-tray">
            <div className='dv-crd-ref-faulty'>

              {/* Mark Faulty */}
                <Tooltip slotProps={{popper: {modifiers: [{name: 'offset',options: {offset: [0, -10]}}]}}} placement="bottom" title="Mark Faulty" disableInteractive>
                  <motion.div whileHover={hover} whileTap={hover2} className='dv-crd-bttn' onClick={handleMarkFaulty}>
                    <img src="/static/images/device/faulty.svg" alt="" />
                  </motion.div>
                </Tooltip>
                {isFault && <MarkFault open={true} handleClose={setIsFault} />}

              {/* Refresh */}
                <Tooltip title="Refresh" slotProps={{popper: {modifiers: [{name: 'offset',options: {offset: [0, -10]}}]}}} placement="bottom" disableInteractive>
                  <motion.div whileHover={hover} whileTap={hover2} className='dv-crd-bttn' onClick={(e) => refreshCard(e,nodeId)}>
                    <img src="/static/images/refresh.svg" alt="" />
                  </motion.div>
                </Tooltip>
              </div>

            {/* Alarm - only shown if there's a fire or smoke. only shows for sensors */}
            {(hasFire || hasRise || hasSmoke) && nodeType.toLowerCase() === 'sensor' && (
              <Tooltip title={`${alarmOn?"Mute alarm":"Unmute alarm"}`} slotProps={{popper: {modifiers: [{name: 'offset',options: {offset: [0, -10]}}]}}} placement="bottom" disableInteractive>
              <motion.div animate={alarmOn?{background:['rgba(255, 255, 255, 0.3','rgba(255, 255, 255, 1','rgba(255, 255, 255, 0.3']}:{background:'rgba(255, 255, 255, 0.3'}} transition={alarmOn?repeatTransition:{}} whileHover={hover} whileTap={hover2} id='dv-alarm' className='dv-crd-bttn' onClick={handleAlarmToggle}>
                <motion.img src={`/static/images/device/${alarmOn?"alarm":"alarm-mute"}.svg`} alt="" />
              </motion.div>
            </Tooltip>
            )}            
        </div>

        {/* Last updated  */}
        <div className="dv-crd-uptd flex-space-row">
            <p>Last updated:</p>
            <div className='dv-crd-uptd-date'>
              <p>
                {lastupdate}
              </p>
            </div>
        </div>

        
    </motion.div>
    </Link>
  )
}

export default DeviceCard
