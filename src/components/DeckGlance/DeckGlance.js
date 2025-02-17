import React, { useEffect, useState } from 'react'
import { FIRE_TEMP, TOTAL_DECKS } from '../../libs/Constants'
import './DeckGlance.css'
import fakeCardData from '../../data/fakeCardData.json'

const DeckGlance = () => {
  const [cardData, setCardData] = useState(fakeCardData);
  const danger = cardData.filter(item => item.temp >= FIRE_TEMP);
  const [deck, setDeck] = useState(danger);

  useEffect(() => {
    setDeck(danger);
    setCardData(fakeCardData);
  }, [fakeCardData]);

  return (
    <div className='deck-gl-mn width-100'>
      {Array.from({ length: TOTAL_DECKS }).map((_,index)=>{
         const deckNo = index + 1;
         const dangerDeckNos = deck.map(item => item.deckno);
        return(
            <div key={`hm-deck-${index}`} className='deck-gl-crd flex-center-row' style={{ width: `${100 - index * 12}%`, background: dangerDeckNos.includes(deckNo) ? "red" : ""}} >
                <p>Deck {index+1}</p>
            </div>
        )
      })}
    </div>
  )
}

export default DeckGlance
