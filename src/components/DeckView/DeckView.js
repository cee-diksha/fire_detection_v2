import React from 'react'
import './DeckView.css'
import DeckWrapper from './DeckWrapper'
import fakeDeckData from "../../data/fakeDeckData.json"
import {useContext,useEffect} from 'react'
import { MainContext } from '../../context/MainContext';

const DeckView = () => {
  const {isDemo} = useContext(MainContext);
  const boxes = Array.from({ length: 60 }, (_, index) => index + 1); 

  useEffect(()=>{
    console.log(isDemo)
  },[isDemo])
  return (
    <div className='dk-vw-mn'>
      {isDemo && (
        <>
        {fakeDeckData.map((item) => {
          return (
              <DeckWrapper key={item.id} data={item} deckNo={item.deck} />
          )
        })} 
        </>
      )}
      {!isDemo && (
        <div className='status-grid-modal' style={{cursor: "pointer"}}>
        <h4>Deck 1</h4>
        <div style={{ marginRight: "14px" }}>
          <div className="grid-container">
            {boxes.map((boxId) => {
              return (
                <div
                id="box"
                className="box"
                style={{
                  backgroundColor: boxId === 2 ? 'red' : 'white',
                  color: boxId === 2 ? 'white' : 'black'
                }}
                >
                {boxId}
                </div>
              );
            })}
          </div>
        </div>
      </div>
        
      )}
      
    </div>
  )
}

export default DeckView
