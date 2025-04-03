import React from 'react'
import './NodeInfo.css'
import DevicesViewToggle from '../DevicesViewToggle/DevicesViewToggle'

const NodeInfo = ({device,isDevice,isDeck}) => {
  return (
    <div className='specific-top'>
        <div  className='specific-header-location' >
            <div className='specific-location-crd-tray'>
            {isDevice && (
                <div className='flex-start-row' style={{gap:'10px'}}>
                    <div className='specific-location-crd'>
                    <p>Node ID</p>
                    <h3>{device.nodeId}</h3>
                    </div>
                    <div id='specific-device-type' className='specific-location-crd'>
                    <p>Device</p>
                    <h3>{device.nodeType}</h3>
                    </div>
                </div>
            )}
            
            

            <div className='flex-start-row' style={{gap:'10px'}}>
                {device.location && (
                    <div  id="specific-location-lc"    className='specific-location-crd'>
                        <p>Location</p>
                        <h3>{device.location}</h3>
                    </div>
                )}
                {device.deckno && (
                    <div className='specific-location-crd'>
                        <p>Deck</p>
                        <h3>{device.deckno}</h3>
                    </div>
                )}        
                {device.compno && (
                    <div className='specific-location-crd'>
                        <p>Compartment</p>
                        <h3>{device.compno}</h3>
                    </div>
                )}
               
            </div>

            {isDeck && (
                <DevicesViewToggle/>
            )}

            </div>
        </div>
    </div>
    
  )
}

export default NodeInfo