import React, {useEffect, useState } from 'react'
import fakeCardData from '../../data/fakeCardData.json'
import noCardData from '../../data/noCardData.json'
import { FIRE_TEMP } from '../../libs/Constants'
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

const AlertTray = () => {

  const [cardsData, setcardsData] = useState(fakeCardData);
  const [AlertCards, setAlertCards] = useState([]);

/* 
  logic to get card data and refresh specific card data
  useEffect(() => {
    sendMessage({ CARDDATA: 1 });

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "CARDDATA") {
        setFakeCardData(data.payload || []);
      }

      if (data.type === "REFRESHED_CARD") {
        setFakeCardData((prevCards) =>
          prevCards.map((card) =>
            card.nodeId === data.payload.nodeId ? data.payload : card
          )
        );
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [sendMessage, socket]); */

  const refreshCard = (nodeId) => {
    console.log('Refreshing Node ',nodeId)
    // sendMessage({ 'REFRESH': nodeId });
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
                {AlertCards.map((card,index)=>{
                    return(
                        <DeviceCard {...card} refreshCard={refreshCard}/>
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
