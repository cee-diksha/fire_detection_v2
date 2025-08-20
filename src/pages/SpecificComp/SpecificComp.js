import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NodeInfo from '../../components/NodeInfo/NodeInfo';
import { URL, RECONNECT_INTERVAL } from '../../libs/Constants';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import { MainContext } from '../../context/MainContext';
import fakeCardData from '../../data/fakeCardData.json';
import './SpecificComp.css'

const MAX_RECONNECT_ATTEMPTS = 20;

const SpecificComp = () => {
    const { deck, comp } = useParams();
    const { isDemo, socketRef, sendMessage, data } = useContext(MainContext);

    
    const [device, setDevice] = useState({ compno: comp, deckno: deck, location: 'No location set' });
    const [devices, setDevices] = useState([]);

   

    useEffect(() => {
        if (!isDemo) {
            const filteredData = data.filter(item =>
                item.deckno.toString() === deck.toString() &&
                item.compno.toString() === comp.toString()
            );
            console.log("Filtered devices:", filteredData);
            setDevices(filteredData);

        } else {
            const filteredData = fakeCardData.filter(item =>
                item.deckno.toString() === deck.toString() &&
                item.compno.toString() === comp.toString()
            );
            setDevices(filteredData);
        }
    }, [deck, comp, isDemo, data]);

    const refreshCard = (event, nodeId) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("Refreshing Node", nodeId);
        
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ "REFRESH": nodeId }));
        } else {
            console.warn("WebSocket not connected, cannot send REFRESH command.");
        }
    };
    

    return (
        <div className='page'>
            <NodeInfo device={device} />
            <div className='specific-crd-tray'>
                {devices.length > 0 ? (
                    devices.map((item, index) => (
                        <DeviceCard key={`Comp-specific-crd-${index}`} {...item} refreshCard={refreshCard} />
                    ))
                ) : (
                    <p>No devices found.</p>
                )}
            </div>
        </div>
    );
};

export default SpecificComp;
