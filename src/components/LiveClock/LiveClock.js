import moment from 'moment';
import React, { useEffect, useState } from 'react'
import './LiveClock.css'

const LiveClock = () => {
    const [currentDateTime, setCurrentDateTime] = useState({
        time: moment().format('h:mm:ss A'),
        date: moment().format('dddd, MMMM Do YYYY')
      });
    
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentDateTime({
            time: moment().format('h:mm:ss A'),
            date: moment().format('dddd, MMMM Do YYYY')
          });
        }, 1000);
    
        // Clean up interval on component unmount
        return () => clearInterval(interval);
      }, []);

      const resetClock = () => {
        setCurrentDateTime({
          time: moment().format('h:mm:ss A'),
          date: moment().format('dddd, MMMM Do YYYY')
        });
      };
    
      return (
        <div className='lv-clk flex-start-row'>
          <div>
            <span className='lv-clk-date'>
              {currentDateTime.date}
            </span>
            <div className='lv-clk-time'>
              {currentDateTime.time}
            </div>
          </div>
         
          <button id='lv-clk-reset' className='bttn-mn' onClick={resetClock}><label>Reset</label></button>
        </div>
      );
}

export default LiveClock;
