import React, { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch'; 
import './Settings.css'
import {motion} from 'motion/react'

const animate = {opacity:0.7}
const animate2 = {opacity:0.5,scale:0.99}
const transition = {duration:0.1,ease:'linear'}

const SettingsTable = ({tableData, settingsSocket}) => {
    const [showModal, setShowModal] = useState(false);
    const [replaced, setReplaced] = useState({})
    const [updatedData, setUpdatedData] = useState(tableData) //saving the table data in a local state to update the details whenever user makes any change

    useEffect(()=>{
        setUpdatedData(tableData);
    },[tableData])
    
    const handleSwitchChange = (nodeid, field) => {
        
        setUpdatedData((prevData) =>
            prevData.map((item) =>
                item.nodeid === nodeid ? { ...item, [field]: !item[field] } : item
            )
        );
    };

    const handleFieldChange = (nodeid, field, value) => {
        // to handle the data of any input fields and update them in the updateData array
        setUpdatedData((prev) => 
            prev.map(item => item.nodeid === nodeid ? { ...item, [field]: value } : item)
        );
    };

    const handleDeleteRow = (nodeid) => {
        // delete a row from the table
        const updated =  updatedData.filter(item => item.nodeid === nodeid )
        setUpdatedData(updated)
    };

    const saveSpecificDeviceData = (item) => {
        const data = {
            temp:60,
            nodeid:item.nodeId.toString(),
            location:item.location,
            deckno:item.deckno,
            compno:item.compno
        }
        //  to send data of a specific device to the settingsSocket
        console.log(`Saving data for node ${item.nodeId}`,JSON.stringify({ "save": data}))
        settingsSocket.send(JSON.stringify({ "save": data}))
    }

    const saveChanges = () => {
        // to save the whole table 

        // console.log(data, "checking dataa");
        // handleReplace()
        // setDeviceInfo(data);
        console.log('Saving all data', JSON.stringify({ "saveall": 1}))
        settingsSocket.send(JSON.stringify({ "saveall": 1}))
    };

     // const handleReplace = () => {
    //     // const {nodeid, value} = replaced
    //     // const updated =  data.map(item =>
    //     //     item.nodeid === nodeid ? { ...item, nodeid: value } : item
    //     // )

    //     // setData(prevData =>
    //     //     prevData.map(item =>
    //     //         item.nodeid === nodeid ? { ...item, nodeid: value } : item
    //     //     )
    //     // );
    //     // setDeviceInfo(updated)
    // }

    return (
        <div className='settings-table-resetbtn-wrapper'>
            
            {/* {showModal && <ConfimationModal open={true} handleClose={setShowModal} />} */}
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Node ID</th>
                            <th>Node Type</th>
                            {/* <th>3 Axis</th> */}
                            <th>Location</th>
                            <th>Temp Setpoint</th>
                            <th>Fire/Smoke Sensor</th>
                            <th>Suppressor</th>
                            <th>Deck No.</th>
                            <th>Comp. No.</th>
                            <th>Connected to Repeater no.</th>
                            {/* <th>Replaced by</th> */}
                            <th>Save</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    {updatedData.map((item, index) => (
                        <tr key={item.nodeid} style={{ opacity: item.isDeleted ? 0.5 : 1 }}>
                            <td>{index + 1}</td>
                            <td>{item.nodeId}</td>
                            <td style={{ textTransform: "capitalize" }}>{item.nodeType}</td>
                            {/* <td>
                                 <input
                                    type="text"
                                    style={{ width: "60%" }}
                                    defaultValue={item.axis}
                                    onChange={(e) => handleFieldChange(item.nodeid, 'axis', e.target.value)}
                                    disabled={item.isDeleted}
                                /> 
                            </td> */}
                            <td>
                                <input
                                    type="text"
                                    style={{ width: "90%" }}
                                    defaultValue={item.location}
                                    onChange={(e) => handleFieldChange(item.nodeid, 'location', e.target.value)}
                                    disabled={item.isDeleted}
                                />
                            </td>
                            <td>
                                {item.tempvalue === null ? "NA" :   <>
                                    <input
                                        type="number"
                                        id="tempInput"
                                        placeholder="Enter a number"
                                        value={item.temp}
                                        style={{ width: "40%" }}
                                        onChange={(e) => handleFieldChange(item.nodeid, 'temp', e.target.value)}
                                        disabled={item.isDeleted}
                                    />
                                    <span> °C</span>
                                </>}
                            </td>
                            <td>
                                {item.smoke !== null ? (
                                    <Switch
                                        sx={{
                                            '& .MuiSwitch-thumb': { backgroundColor: "#3F3F3F" },
                                            '& .MuiSwitch-track': { backgroundColor: "#3F3F3F" }
                                        }}
                                        checked={item.smoke}
                                        onChange={() => handleSwitchChange(item.nodeid, 'smoke')}
                                        disabled={item.isDeleted || item.nodeType.toLowerCase() === 'repeater' || item.nodeType.toLowerCase() === 'suppressor'}
                                    />
                                    
                                ) : (
                                    "NA" 
                                )}
                            </td>
                            <td>
                                {item.supp !== null ? (
                                     <Switch
                                         sx={{
                                             '& .MuiSwitch-thumb': { backgroundColor: "#3F3F3F" },
                                             '& .MuiSwitch-track': { backgroundColor: "#3F3F3F" }
                                         }}
                                         checked={item.supp}
                                         onChange={() => handleSwitchChange(item.nodeid, 'supp')}
                                         disabled={item.isDeleted || item.nodeType.toLowerCase() === 'repeater' || item.nodeType.toLowerCase === 'suppressor'}
                                     />
                                
                                ) : (
                                    "NA" 
                                )}
                            </td>
                            <td>
                                <input
                                        type="text"
                                        style={{ width: "60%" }}
                                        defaultValue={item.deckno}
                                        onChange={(e) => handleFieldChange(item.nodeid, 'deckno', e.target.value)}
                                        disabled={item.isDeleted}
                                    />
                            </td>
                            <td>
                                <input
                                        type="text"
                                        style={{ width: "60%" }}
                                        defaultValue={item.compno}
                                        onChange={(e) => handleFieldChange(item.nodeid, 'compno', e.target.value)}
                                        disabled={item.isDeleted}
                                    />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    style={{ width: "60%" }}
                                    defaultValue={item.connectedto !== null ? item.connectedto : null}
                                    onChange={(e) => handleFieldChange(item.nodeid, 'connectedto', e.target.value)}
                                    disabled={item.isDeleted}
                                />
                            </td>
                             <td>
                                <motion.button id='save' whileHover={{opacity:0.7}} whileTap={{opacity:0.5,scale:0.99}} className="bttn-mn" onClick={() => saveSpecificDeviceData(item)}>
                                    <label>Save</label>
                                </motion.button>
                            </td>
                            <td>
                                <motion.button whileHover={{opacity:0.7}} whileTap={{opacity:0.5,scale:0.99}} className="bttn-mn" onClick={() => handleDeleteRow(item.nodeid)}>
                                    <label>{item.isDeleted ? "Undo" : "Delete"}</label>
                                </motion.button>
                            </td>
                            {/* <td>
                                <input
                                    type="text"
                                    style={{ width: "60%" }}
                                    defaultValue={null}
                                    onChange={(e) => setReplaced({nodeid: item.nodeid, value: e.target.value})}
                                    disabled={item.isDeleted}
                                />
                            </td> */}
                        </tr>
                    ))}
                </tbody>

                </table>
            </div>
            
            <div id="btn-wrapper-table" className='flex-end-row'>
                <motion.button whileHover={animate} whileTap={animate2} transition={transition} className='bttn-mn' id="save-all-changes" onClick={saveChanges}><label htmlFor="save-all-changes">Save Changes</label></motion.button>
                <motion.button whileHover={{opacity:0.7}} whileTap={{opacity:0.5,scale:0.99}} className='bttn-mn' id="reset-database" onClick={() => setShowModal(true)}><label htmlFor="reset-database">Reset Database</label></motion.button>
            </div>
               
        </div>
    );
};

export default SettingsTable;
