import React, {useEffect, useState } from 'react'
import fakeCardData from '../../data/fakeCardData.json'
import noCardData from '../../data/noCardData.json'
import { FIRE_TEMP, URL } from '../../libs/Constants'
import DeviceCard from '../../components/DeviceCard/DeviceCard'
import './AlertTray.css'


const getPriority = (statusArray, temp, batp) => {
  if (batp === 0) return 5; // 'replace' (highest priority)
  if (temp >= FIRE_TEMP) return 1; // 'fire'
  if (statusArray.includes("Temp rise")) return 2; // 'temprise'
  if (statusArray.includes("Smoke")) return 3; // 'smoke'
  if (statusArray.includes("Low Bat") || statusArray.includes("low bat")) return 4; // 'lowbat'
  return Infinity; // Normal cards (no priority)
};

const AlertTray = ({socket,data}) => {

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
                card.batp <= 20 ||
                card.temp >= FIRE_TEMP ||
                card.status.length > 0
            )
            .sort((a, b) => getPriority(a.status, a.temp, a.batp) - getPriority(b.status, b.temp, b.batp));

        setAlertCards(filteredAndSorted.length > 0 ? filteredAndSorted : []);
        }, [cardsData]);

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