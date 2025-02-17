import React from 'react'
import { TOTAL_DECKS } from '../../libs/Constants'
import './DeckGlance.css'

const DeckGlance = () => {
    
  return (
    <div className='deck-gl-mn width-100'>
        
      {Array.from({ length: TOTAL_DECKS }).map((_,index)=>{
        return(
            <div key={`hm-deck-${index}`} className='deck-gl-crd flex-center-row' style={{ width: `${100 - index * 12}%`}}>
                <p>Deck {index+1}</p>
            </div>
        )
      })}
    </div>
  )
}

export default DeckGlance
