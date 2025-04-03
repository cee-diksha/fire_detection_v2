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
    const { isDemo } = useContext(MainContext);
    
    const [device, setDevice] = useState({ compno: comp, deckno: deck, location: 'No location set' });
    const [devices, setDevices] = useState([]);
    const [connectedState, setConnectedState] = useState("connecting");

    const socketRef = useRef(null);
    const reconnectAttempts = useRef(0);

    useEffect(() => {
        if (!isDemo) {
            setDevices([]);
            setConnectedState("connecting");
            connectWebSocket();
        } else {
            const filteredData = fakeCardData.filter(item =>
                item.deckno.toString() == deck.toString() &&
                item.compno.toString() == comp.toString()
            );
            console.log(filteredData)
            setDevices(filteredData);
            cleanUpWebSocket();
            setConnectedState(false);
        }

        return () => {
            cleanUpWebSocket();
        };
    }, [deck, comp, isDemo]);

    const connectWebSocket = () => {
        cleanUpWebSocket();
        console.log('Connecting to WebSocket Server');

        setConnectedState("connecting");

        const specificSocket = new WebSocket(`${URL}/ws/dashboard`);
        socketRef.current = specificSocket;

        specificSocket.onopen = () => {
            console.log('Connected to WebSocket Server');
            setConnectedState("connected");
            reconnectAttempts.current = 0;
            
            // Send DECK request
            specificSocket.send(JSON.stringify({ "COMP": { "compno": comp, "deckno": deck } }));
        };

        specificSocket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                console.log('Received data:', response);

                // Ensure response is an array
                if (Array.isArray(response)) {
                    setDevices(response);
                    setDevice(response[0])
                } else {
                    setDevices([]);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        specificSocket.onclose = (event) => {
            console.log('WebSocket Disconnected.', event);
            if (!event.wasClean && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                console.warn('WebSocket closed unexpectedly, attempting to reconnect...');
                setConnectedState("reconnecting");
                reconnectWebSocket();
            } else {
                setConnectedState("error");
            }
        };

        specificSocket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setConnectedState("error");
        };
    };

    const cleanUpWebSocket = () => {
        if (socketRef.current) {
            console.log('Cleaning up WebSocket connection...');
            socketRef.current.onopen = null;
            socketRef.current.onmessage = null;
            socketRef.current.onclose = null;
            socketRef.current.onerror = null;
            socketRef.current.close();
            socketRef.current = null;
        }
    };

    const reconnectWebSocket = () => {
        reconnectAttempts.current += 1;
        console.log(`Reconnecting attempt ${reconnectAttempts.current}...`);
        setTimeout(() => {
            if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
                connectWebSocket();
            }
        }, RECONNECT_INTERVAL);
    };

    const handleTouch = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };
    

    const refreshCard = (e,nodeId) => {
        console.log('Refreshing Node ',nodeId)
        // dashBoardSocket.emit("REFRESH", nodeId)
        handleTouch(e)
        if (socketRef && socketRef.readyState === WebSocket.OPEN) {
          socketRef.send(JSON.stringify({ "REFRESH" : nodeId }));
        } else {
          console.warn("webSocket not connected");
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
