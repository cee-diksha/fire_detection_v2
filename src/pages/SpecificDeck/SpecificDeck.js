import React, { useContext, useEffect, useRef, useState } from 'react'
import NodeInfo from '../../components/NodeInfo/NodeInfo'
import { useParams } from 'react-router-dom';
import DeckWrapper from '../../components/DeckView/DeckWrapper';
import fakeCardData from '../../data/fakeCardData.json'
import { RECONNECT_INTERVAL } from '../../libs/Constants';
import { MainContext } from '../../context/MainContext';

const MAX_RECONNECT_ATTEMPTS = 15

const SpecificDeck = () => {
  const { deck} = useParams();
  const { sendMessage, socketRef } = useContext(MainContext)

  const [device,setDevice] = useState({"deckno":deck,"location":"Not set yet"})
  const { isDemo } = useContext(MainContext);
    
  const [devices, setDevices] = useState([]);
  const [connectedState, setConnectedState] = useState("connecting");

  const reconnectAttempts = useRef(0);

    useEffect(() => {
        if (!isDemo) {
            setDevices([]);
            
        } else {
            const filteredData = fakeCardData.filter(item =>
                item.deckno.toString() === deck.toString()
            );
            console.log(filteredData, "filteredData")
            setDevices(filteredData);
          }
    }, [deck, isDemo]);


    const handleTouch = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };
    

    const refreshCard = (e,nodeId) => {
        console.log('Refreshing Node ',nodeId)
        // dashBoardSocket.emit("REFRESH", nodeId)
        handleTouch(e)
        if (socketRef && socketRef.readyState === WebSocket.OPEN) {
          socketRef.send(JSON.stringify({ "REFRESH" : nodeId }));
        } else {
          console.warn("webSocket not connected");
        }
      };

  return (
    <div className='page'>
      <NodeInfo device={device}/>
      <section>
        
      </section>
    </div>
  )
}

export default SpecificDeck