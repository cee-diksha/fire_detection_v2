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
    const { isDemo, socketRef, sendMessage } = useContext(MainContext);

    
    const [device, setDevice] = useState({ compno: comp, deckno: deck, location: 'No location set' });
    const [devices, setDevices] = useState([]);

   

    useEffect(() => {
        if (!isDemo) {
            setDevices([]);

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                console.log("Sending COMP request:", { compno: comp, deckno: deck });
                sendMessage({ "COMP": { "compno": comp, "deckno": deck } });
            } else {
                console.warn("WebSocket not connected yet. Waiting...");
            }
        } else {
            const filteredData = fakeCardData.filter(item =>
                item.deckno.toString() === deck.toString() &&
                item.compno.toString() === comp.toString()
            );
            setDevices(filteredData);
        }
    }, [deck, comp, isDemo, socketRef]);

    useEffect(() => {
            if (isDemo || !socketRef.current) return;
        
            const handleMessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    console.log("Received data:", response);
        
                    if (!Array.isArray(response)) {
                        response = [response]; // Ensure response is always an array
                    }
        
                    setDevices((prevDevices) => {
                        const updatedDevices = [...prevDevices];
        
                        response.forEach((newDevice) => {
                            const existingIndex = updatedDevices.findIndex(
                                (device) => device.nodeId === newDevice.nodeId
                            );
        
                            if (existingIndex !== -1) {
                                const existingDevice = updatedDevices[existingIndex];
        
                                // Check if any field has changed
                                const hasChanged = Object.keys(newDevice).some(
                                    (key) => newDevice[key] !== existingDevice[key]
                                );
        
                                if (hasChanged) {
                                    updatedDevices[existingIndex] = newDevice;
                                }
                            } else {
                                updatedDevices.push(newDevice);
                            }
                        });
        
                        return updatedDevices;
                    });
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };
        
            socketRef.current.addEventListener("message", handleMessage);
        
            return () => {
                socketRef.current.removeEventListener("message", handleMessage);
            };
        }, [isDemo, socketRef]);

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
