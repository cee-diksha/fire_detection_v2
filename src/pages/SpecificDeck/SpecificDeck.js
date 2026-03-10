import React, { useContext, useEffect, useRef, useState } from 'react'
import NodeInfo from '../../components/NodeInfo/NodeInfo'
import { useParams } from 'react-router-dom';
import fakeCardData from '../../data/fakeCardData.json'
import { MainContext } from '../../context/MainContext';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import './SpecificDeck.css'

const MAX_RECONNECT_ATTEMPTS = 15

const SpecificDeck = () => {
  const { deck } = useParams();
  const { socketRef, isDemo, viewToggle, data } = useContext(MainContext)

  const [device, setDevice] = useState({ "deckno": deck, "location": "Not set yet" })

  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (!isDemo) {

      const filteredData = data.filter(item =>
        item.deckno?.toString() === deck?.toString()
      );
      setDevices(filteredData)
    } else {
      const filteredData = fakeCardData.filter(item =>
        item.deckno?.toString() === deck?.toString()
      );
      setDevices(filteredData);
    }
  }, [deck, isDemo, data]);



  return (
    <div className='page'>
      <NodeInfo device={device} isDeck={true} />
      <section className='sp-d-sec'>
        <h3 className='sp-d-head'>Online devices</h3>
        <div className='specific-deck-tray'>
          {devices.filter((device) => device.statusCode === 1).length > 0 ? (
            devices
              .filter((device) => device.statusCode === 1) // Only show devices with statusCode 1
              .map((item, index) => (
                <DeviceCard key={`Comp-specific-crd-${index}`} {...item} />
              ))
          ) : (
            <p>No devices found.</p>
          )}
        </div>
      </section>
      <section className='sp-d-sec'>
        <h3 className='sp-d-head'>Offline devices</h3>
        <div className='specific-deck-tray'>
          {devices.filter((device) => device.statusCode === 0).length > 0 ? (
            devices
              .filter((device) => device.statusCode === 0) // Only show devices with statusCode 0
              .map((item, index) => (
                <DeviceCard key={`Comp-specific-crd-${index}`} {...item} />
              ))
          ) : (
            <p>No offline devices.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default SpecificDeck