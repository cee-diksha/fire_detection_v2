import React from 'react'
import "./AlertLedger.css"


const AlertLedger = () => {
  return (
    <div className='alert-wrapper'>
       {/* <div className='alert-details-combined' > */}
           
        {/* </div> */}
        <div className='alert-label-wrap'>
            <div className='alert-details-combined' >
                <div id="alert-details-span3" style={{background: "var(--fire-alert)"}}></div>
                <div id="alert-details-span1">Fire</div>
            </div>
            <div className='alert-details-combined' >
                <div id="alert-details-span3" style={{background: "var(--replace-alert)"}}></div>
                <div id="alert-details-span1">Replacement</div>
            </div>
            <div className='alert-details-combined' >
                <div id="alert-details-span3"style={{background: "var(--temp-alert)"}}></div>
                <div id="alert-details-span1">Temp Rise</div>
            </div>
            <div className='alert-details-combined' >
                <div id="alert-details-span3" style={{background: "var(--battery-alert)"}}></div>
                <div id="alert-details-span1">Low Battery</div>
            </div>
            <div className='alert-details-combined' >
                <div id="alert-details-span3" style={{background: "var(--smoke-alert)"}}></div>
                <div id="alert-details-span1">Smoke</div>
            </div>
            <div className='alert-details-combined' >
                <div id="alert-details-span3" style={{background: "var(--normal)"}}></div>
                <div id="alert-details-span1">Normal</div>
            </div>
        </div>
    </div>
  )
}

export default AlertLedger
