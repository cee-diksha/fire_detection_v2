import React, {use, useContext, useEffect, useState } from 'react'
import fakeCardData from '../../data/fakeCardData.json'
import noCardData from '../../data/noCardData.json'
import { FIRE_TEMP, URL } from '../../libs/Constants'
import DeviceCard from '../../components/DeviceCard/DeviceCard'
import './AlertTray.css'
import { MainContext } from '../../context/MainContext'


const getPriority = (statusArray, tempvalue, batp, statusCode) => {
  if (statusCode === 0 || batp === 0) return 999; // Replace (Always last)
  if (tempvalue >= FIRE_TEMP) return 1; // Fire (Highest priority)
  if (statusArray.includes("smoke")) return 2; // Smoke
  if (statusArray.includes("tempvalue rise")) return 3; // Tempvalue rise
  if (statusArray.includes("low bat")) return 4; // Low Battery
  return Infinity; // Normal cards (no priority)
};


const AlertTray = ({socket,data}) => {
  const { fireNodes, smokeNodes} = useContext(MainContext)
  const [cardsData, setcardsData] = useState([]);
  const [AlertCards, setAlertCards] = useState([]);

  const handleTouch = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(()=>{
    setcardsData(data)
  },[data])

  const refreshCard = (e,nodeId) => {
    console.log('Refreshing Node ',nodeId)
    // dashBoardSocket.emit("REFRESH", nodeId)
    handleTouch(e)
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ "REFRESH" : nodeId }));
    } else {
      console.warn("webSocket not connected");
    }
  };


    useEffect(() => {
      const filteredAndSorted = cardsData
      .filter(
        (card) =>
          card.statusCode === 0 ||
          card.batp <= 20 ||
          card.tempvalue >= FIRE_TEMP ||
          card.status.some(statusItem => statusItem.trim() !== "") ||
          (Array.isArray(fireNodes) && fireNodes.some(f => f.nodeId === card.nodeId)) ||
          (Array.isArray(smokeNodes) && smokeNodes.some(f => f.nodeId === card.nodeId))
      )      
  .sort((a, b) => {
    const priorityA = getPriority(a.status, a.tempvalue, a.batp, a.statusCode);
    const priorityB = getPriority(b.status, b.tempvalue, b.batp, b.statusCode);

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // Sort by priority
    }

    return b.tempvalue - a.tempvalue; // If same priority, sort by highest tempvalue first
  });

    

        setAlertCards(filteredAndSorted.length > 0 ? filteredAndSorted : []);
        }, [cardsData,fireNodes,smokeNodes]);

  return (
    <>
        <div className='alert-tray'>
       
            {AlertCards.length > 0 && (
                <>
                {AlertCards.map((card)=>{
                    return(
                        <DeviceCard {...card} refreshCard={refreshCard} key={card.nodeId} />
                    )
                })}
                </>
            )}
            {!AlertCards.length > 0 && (
                <div className='no-alert flex-center-col'>
                    <h2>No alerts detected.</h2>
                    <span>All devices are functioning normally</span>
                </div>
            )}  
            
        </div>  
  </>   
  )
}

export default AlertTray