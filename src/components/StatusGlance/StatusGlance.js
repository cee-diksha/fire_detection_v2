import React, { useEffect, useState } from 'react'
import { totalUnits } from '../../utils/TotalUnits'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import './StatusGlance.css'


const StatusGlance = ({ data }) => {
    const [cardData, setcardData] = useState([])
    const [open, setOpen] = useState(false);
    const functional = (totalUnits(cardData, "repeater") + totalUnits(cardData, "sensor") + totalUnits(cardData, "suppressor"))
    const percentage = cardData.length > 0 ? Math.ceil((functional / cardData.length) * 100) : 0;

    useEffect(() => {
        setcardData(data)
    }, [data])

    return (
        <div className='sum-details'>
            <h4>System Status</h4>
            {!open && (
                <div className='sum-guage'>
                    <Gauge
                        cornerRadius="50%"
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 18,
                                fontWeight: 600,
                                transform: 'translate(3px, -4px)',
                                fill: 'white !important',
                                color: 'white',
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: '#52b202',
                            },
                        }}
                        text={
                            ({ value }) => `${value}%`}
                        width={150}
                        height={80}
                        value={percentage}
                        startAngle={-90}
                        endAngle={90}
                    />
                </div>
            )}


            {open && (
                <div className='sum-more-details'>
                    <div className='sum-details-combined' >
                        <div id="sum-details-span1">Repeaters</div>
                        <div id="sum-details-span2">{totalUnits(cardData, "repeater")}/{cardData.filter(item => item?.nodeType?.toLowerCase() === "repeater").length}</div>
                    </div>
                    <div className='sum-details-combined' >
                        <div id="sum-details-span1">Smoke/Fire Sensors</div>
                        <div id="sum-details-span2">{totalUnits(cardData, "sensor")}/{cardData.filter(item => item?.nodeType?.toLowerCase() === "sensor").length}</div>
                    </div>
                    <div className='sum-details-combined' >
                        <div id="sum-details-span1">Suppressor</div>
                        <div id="sum-details-span2">{totalUnits(cardData, "suppressor")}/{cardData.filter(item => item?.nodeType?.toLowerCase() === "suppressor").length}</div>
                    </div>
                </div>
            )}

            <div className='sum-details-combined' >
                <div id="sum-details-span1">Active devices</div>
                <div id="sum-details-span2">{functional}/{cardData.length}</div>
            </div>
            <div className='sum-all-div' onClick={() => { setOpen(!open) }}>
                {open ? <span>Show Guage</span> : <span>Show All</span>}

            </div>
        </div>
    )
}

export default StatusGlance
