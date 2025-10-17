import React, { useState } from 'react'
import './DeckView.css'
import DeckWrapper from './DeckWrapper'
import fakeDeckData from "../../data/fakeDeckData.json"
import {useContext,useEffect} from 'react'
import { MainContext } from '../../context/MainContext';
import { FIRE_TEMP } from '../../libs/Constants'

const DeckView = ({data}) => {
  const {isDemo} = useContext(MainContext);
  const boxes = Array.from({ length: 60 }, (_, index) => index + 1); 

  useEffect(()=>{
    console.log("in Demo mode :", isDemo)
  },[isDemo])
  
  const [deckview, setDeckview] = useState([
    { deck: 1, danger: [], normal: [], temprise: [], lowbattery: [], deleted: [], smoke: [] },
    { deck: 2, danger: [], normal: [], temprise: [], lowbattery: [], deleted: [], smoke: [] },
    { deck: 3, danger: [], normal: [], temprise: [], lowbattery: [], deleted: [], smoke: [] },
    { deck: 4, danger: [], normal: [], temprise: [], lowbattery: [], deleted: [], smoke: [] },
    { deck: 5, danger: [], normal: [], temprise: [], lowbattery: [], deleted: [], smoke: [] },
    { deck: 6, danger: [], normal: [], temprise: [], lowbattery: [], deleted: [], smoke: [] },
  ]);

  useEffect(() => {
    const updatedDecks = deckview.map((deck) => ({
      ...deck,
      danger: [],
      normal: [],
      temprise: [],
      lowbattery: [],
      deleted: [],
      smoke: [],
    }));

    data.forEach((node) => {
      const deckNumber = Number(node.deckno); // Ensure it's a number
      const compNumber = Number(node.compno); // Ensure it's a number
      const deckIndex = updatedDecks.findIndex((d) => d.deck === deckNumber);

      if (deckIndex !== -1) {
        if (node.statusCode === 0) {
          updatedDecks[deckIndex].deleted.push(compNumber);
        }
        if (node.status?.includes("low bat")) {
          updatedDecks[deckIndex].lowbattery.push(compNumber);
        }
        if (node.statu?.includes("temp rise")) {
          updatedDecks[deckIndex].temprise.push(compNumber);
        }
        if (node.tempvalue >= FIRE_TEMP) {
          updatedDecks[deckIndex].danger.push(compNumber);
        }
       
        if (node.status?.includes("smoke")) {
          updatedDecks[deckIndex].smoke.push(compNumber);
        }
        if (node.status?.length === 0) {
          updatedDecks[deckIndex].normal.push(compNumber);
        }
      }
    });
    const sortedDecks = updatedDecks.sort((a, b) => {
      return (
          b.danger.length - a.danger.length ||
          b.temprise.length - a.temprise.length ||
          b.smoke.length - a.smoke.length ||
          b.lowbattery.length - a.lowbattery.length
      );}).map(deck => deck)

    setDeckview(sortedDecks);
  }, [data]);


  useEffect(()=>{
    console.log('Deck view: ',deckview)
  },[deckview])

  return (
    <div className='dk-vw-mn'>
      {isDemo && (
        <>
        {fakeDeckData.sort((a, b) => {
      return (
          b.danger.length - a.danger.length ||
          b.temprise.length - a.temprise.length ||
          b.smoke.length - a.smoke.length ||
          b.lowbattery.length - a.lowbattery.length
      );}).map(deck => deck).map((item) => {
          return (
              <DeckWrapper key={item.id} data={item} deckNo={item.deck}/>
          )
        })} 
        </>
      )}
      {!isDemo && (
         <>
          {deckview.map((item)=>{
            return(
              <DeckWrapper key={item.id} data={item} deckNo={item.deck}/>
            )
          })}
         </>
      )}
      
    </div>
  )
}

export default DeckView
