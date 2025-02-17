import React, { useContext } from 'react'
import { MainContext } from '../../context/MainContext';
import './DemoButton.css'

const DemoButton = () => {
    const {isDemo, setIsDemo} = useContext(MainContext);
  return (
    <div className='width-100'>
        <button id="demo-bttn" style={isDemo?{color:'white',background:'rgba(255, 0, 0, 0.8)'}:{color:'white',background:'rgba(0, 128, 0, 0.8)'}} className='bttn-mn width-100' onClick={()=>{setIsDemo(prev=>!prev)}}>
            <label htmlFor="demo-bttn">{isDemo?"Online":"Live"}</label>
        </button>
    </div>
  )
}

export default DemoButton
