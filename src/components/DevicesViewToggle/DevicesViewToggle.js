import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../context/MainContext';
import './DevicesViewToggle.css';
import { motion } from 'motion/react';

const DevicesViewToggle = () => {
    const { viewToggle, setViewToggle } = useContext(MainContext);
    const buttons = ["Alert Devices", "All Devices", "Compartment View"];
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        setViewToggle(buttons[selected].toLowerCase().replaceAll(' ', '-'));
        console.log(buttons[selected].toLowerCase().replaceAll(' ', '-'))
    }, [selected, setViewToggle]);

    return (
        <div id='device-v-tggle-div' className='dv-tgl-mn'>
            <div className='dv-tgl-ttle'>
                <img src='/static/images/toggle.svg' alt="Toggle Icon" />
                <p>View </p>
            </div>

            <div className='dv-tgl-tray'>
                {buttons.map((button, index) => (
                    <motion.div
                        className={`dv-tgl-bttn ${selected === index ? 'dv-tgl-bttn-active' : ''}`}
                        key={`toggle-button-${index}`}
                        onClick={() => setSelected(index)}
                    >
                        {button}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DevicesViewToggle;
