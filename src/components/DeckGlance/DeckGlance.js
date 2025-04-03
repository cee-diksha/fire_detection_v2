import React, { useEffect, useState } from 'react'
import { FIRE_TEMP, TOTAL_DECKS } from '../../libs/Constants'
import './DeckGlance.css'
import { Link } from 'react-router-dom';

const DeckGlance = ({data}) => {
  const [cardData, setCardData] = useState([]);
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    setCardData(data);
  }, [data]);

  useEffect(() => {
    const danger = cardData.filter(item => item.tempvalue >= FIRE_TEMP);
    setDeck(danger)
  }, [cardData])

  return (
    <div className='deck-gl-mn width-100'>
      {Array.from({ length: TOTAL_DECKS }).map((_,index)=>{
         const deckNo = index + 1;
         const dangerDeckNos = deck.map(item => parseInt(item.deckno));
        return(
            
            <div key={`hm-deck-${index}`} className='deck-gl-crd flex-center-row' style={{ width: `${100 - index * 12}%`, background: dangerDeckNos.includes(deckNo) ? "red" : ""}} >
              <Link to={`/deck/${deckNo}`}>
                <p>Deck {index+1}</p>
              </Link>
            </div> 
            
        )
      })}
    </div>
  )
}

export default DeckGlance
