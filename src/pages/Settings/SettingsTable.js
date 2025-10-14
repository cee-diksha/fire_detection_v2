import React, { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch'; 
import './Settings.css'
import {motion} from 'motion/react'

const animate = {opacity:0.7}
const animate2 = {opacity:0.5,scale:0.99}
const transition = {duration:0.1,ease:'linear'}

const SettingsTable = ({tableData, settingsSocket, newDevices = [], setNewDevices, setTableData}) => {
    const [showModal, setShowModal] = useState(false);
    const [replaced, setReplaced] = useState({})
    const [updatedData, setUpdatedData] = useState(tableData)
    const [originalData, setOriginalData] = useState(tableData);

    useEffect(()=>{
        setUpdatedData(tableData);
        setOriginalData(tableData);
    },[tableData]);

    const hasChanges = (item) => {
        const original = originalData.find(d => d.nodeId === item.nodeId);
        if (!original) return true;
        return (
            original.temp !== item.temp ||
            original.location !== item.location ||
            original.deckno !== item.deckno ||
            original.compno !== item.compno ||
            original.connectedto !== item.connectedto ||
            original.supp !== item.supp ||
            original.smoke !== item.smoke
        );
    };
    
    const handleSwitchChange = (nodeId, field) => {
        console.log("[settings] toggling", nodeId, field);
      
        setUpdatedData((prevData) =>
          prevData.map((item) =>
            item.nodeId === nodeId
              ? {
                  ...item,
                  [field]: item[field] === "checked" ? "unchecked" : "checked",
                }
              : item
          )
        );
      };
      

    const handleFieldChange = (nodeId, field, value) => {
        // to handle the data of any input fields and update them in the updateData array
        setUpdatedData((prev) => 
            prev.map(item => item.nodeId === nodeId ? { ...item, [field]: value } : item)
        );
    };

    const handleDeleteRow = (nodeId) => {
        // Optimistic UI: remove the row immediately from local state
        setUpdatedData((prev) => prev.filter((item) => item.nodeId !== nodeId));
      
        // Update parent component's tableData
        if (setTableData) {
          setTableData((prev) => prev.filter((item) => item.nodeId !== nodeId));
        }
      
        // Remove from newDevices in parent
        if (setNewDevices) {
          setNewDevices((prev) => prev.filter((id) => id !== nodeId));
        }
      
        // Notify backend
        try {
          if (settingsSocket && settingsSocket.readyState === WebSocket.OPEN) {
            console.log("[settings] Sending delete for nodeId:", JSON.stringify({ "remove": nodeId}));
            settingsSocket.send(JSON.stringify({ "remove": nodeId }));
          } else {
            console.warn("[settings] settingsSocket not open; delete not sent");
          }
        } catch (err) {
          console.error("[settings] Failed to send delete:", err);
        }
      };

      const saveSpecificDeviceData = (item) => {
        const data = {
          temp: item.temp,
          nodeid: item.nodeId.toString(),
          location: item.location,
          deckno: item.deckno,
          compno: item.compno,
          supp: item.supp,
          smoke: item.smoke,
        };
      
        if (settingsSocket?.readyState === WebSocket.OPEN) {
          settingsSocket.send(JSON.stringify({ save: data }));
        }
      
        // Update originalData locally
        setOriginalData((prev) =>
          prev.map((d) => (d.nodeId === item.nodeId ? { ...item } : d))
        );
      
        // Remove from newDevices in parent
        if (setNewDevices) {
          setNewDevices((prev) => prev.filter((id) => id !== item.nodeId));
        }
      };
      

    const saveChanges = () => {
        // to save the whole table 
        console.log('[settings] Saving all data', JSON.stringify({ "saveall": 1}))
        settingsSocket.send(JSON.stringify({ "saveall": 1}))
    };

    const handleResetDatabase = () => {
        setUpdatedData([]);
      
        // Clear tableData in parent
        if (setTableData) {
          setTableData([]);
        }
      
        // Clear newDevices in parent
        if (setNewDevices) {
          setNewDevices([]);
        }
      
        console.log('[settings] Deleting all nodes', JSON.stringify({ "deleteall": 1}))
        settingsSocket.send(JSON.stringify({"deleteall": 1 }));
      };
      

    return (
        <div className='settings-table-resetbtn-wrapper'>
            {updatedData.length === 0 && (
                <div className='no-nodes-st'>
                    No Devices stored.
                </div>
            )}
            {updatedData.length >= 1 && (
                <>
                <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Node ID</th>
                            <th>Node Type</th>
                            <th>Location</th>
                            <th>Temp Setpoint</th>
                            <th>Detect Smoke</th>
                            <th>Suppressor Manual/Auto</th>
                            <th>Deck No.</th>
                            <th>Comp. No.</th>
                            <th>Connected to Repeater no.</th>
                            <th>Save</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    {updatedData.map((item, index) => (
                        <tr key={item.nodeId} style={{ opacity: item.isDeleted ? 0.5 : 1 }}>
                            <td>{index + 1}</td>
                            <td>{item.nodeId}</td>
                            <td style={{ textTransform: "capitalize" }}>{item.nodeType}</td>
                            <td>
                                <input
                                    type="text"
                                    style={{ width: "90%" }}
                                    defaultValue={item.location}
                                    onChange={(e) => handleFieldChange(item.nodeId, 'location', e.target.value)}
                                    disabled={item.isDeleted}
                                />
                            </td>
                            <td>
                            {item.nodeType?.toLowerCase() === "repeater" || item.tempvalue === null ? (
                                "NA"
                            ) : (
                                <>
                                <input
                                    type="number"
                                    id="tempInput"
                                    placeholder="Enter a number"
                                    value={item.temp}
                                    style={{ width: "40%" }}
                                    onChange={(e) => handleFieldChange(item.nodeId, "temp", e.target.value)}
                                    disabled={item.isDeleted}
                                />
                                <span> °C</span>
                                </>
                            )}
                            </td>

                            <td>
                                {item.smoke !== null ? (
                                    <Switch
                                        sx={{
                                            '& .MuiSwitch-thumb': { backgroundColor: "#3F3F3F" },
                                            '& .MuiSwitch-track': { backgroundColor: "#3F3F3F" }
                                        }}
                                        checked={item.smoke==="checked"}
                                        onChange={() => handleSwitchChange(item.nodeId, 'smoke')}
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
                                         checked={item.supp==="checked"}
                                         onChange={() => handleSwitchChange(item.nodeId, 'supp')}
                                         disabled={item.isDeleted || item.nodeType.toLowerCase() === 'repeater' || item.nodeType.toLowerCase() === 'suppressor'}
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
                                        onChange={(e) => handleFieldChange(item.nodeId, 'deckno', e.target.value)}
                                        disabled={item.isDeleted}
                                    />
                            </td>
                            <td>
                                <input
                                        type="text"
                                        style={{ width: "60%" }}
                                        defaultValue={item.compno}
                                        onChange={(e) => handleFieldChange(item.nodeId, 'compno', e.target.value)}
                                        disabled={item.isDeleted}
                                    />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    style={{ width: "60%" }}
                                    defaultValue={item.connectedto !== null ? item.connectedto : null}
                                    onChange={(e) => handleFieldChange(item.nodeId, 'connectedto', e.target.value)}
                                    disabled={item.isDeleted}
                                />
                            </td>
                            <td>
                                <motion.button
                                    whileHover={
                                    Array.isArray(newDevices) && (newDevices.includes(item.nodeId) || hasChanges(item))
                                        ? { scale: 1.02 }
                                        : {} // no hover animation if disabled
                                    }
                                    whileTap={
                                    Array.isArray(newDevices) && (newDevices.includes(item.nodeId) || hasChanges(item))
                                        ? { scale: 0.98 }
                                        : {}
                                    }
                                    animate={{
                                    backgroundColor:
                                        Array.isArray(newDevices) && (newDevices.includes(item.nodeId) || hasChanges(item))
                                        ? '#22c55e'
                                        : '#6b7280', 
                                    opacity:
                                        Array.isArray(newDevices) && (newDevices.includes(item.nodeId) || hasChanges(item))
                                        ? 1
                                        : 0.5,
                                    cursor:
                                        Array.isArray(newDevices) && (newDevices.includes(item.nodeId) || hasChanges(item))
                                        ? 'pointer'
                                        : 'default', 
                                    }}
                                    transition={{ duration: 0.2, ease: 'linear' }}
                                    className="bttn-mn"
                                    disabled={!(Array.isArray(newDevices) && (newDevices.includes(item.nodeId) || hasChanges(item)))}
                                    onClick={() => saveSpecificDeviceData(item)}
                                >
                                    <span className='!font-semibold'>Save</span>
                                </motion.button>
                                </td>

                            <td>
                                <motion.button whileHover={{opacity:0.7}} whileTap={{opacity:0.5,scale:0.99}} className="bttn-mn" onClick={() => handleDeleteRow(item.nodeId)}>
                                    <label>{item.isDeleted ? "Undo" : "Delete"}</label>
                                </motion.button>
                            </td>
                        </tr>
                    ))}
                </tbody>

                </table>
            </div>
            
   
                </>
            )}
            <div id="btn-wrapper-table" className='flex-end-row'>
                <motion.button whileHover={animate} whileTap={animate2} transition={transition} className='bttn-mn' id="save-all-changes" onClick={saveChanges}><label htmlFor="save-all-changes">Save to Database</label></motion.button>
                <motion.button whileHover={{opacity:0.7}} whileTap={{opacity:0.5,scale:0.99}} className='bttn-mn' id="reset-database" onClick={handleResetDatabase}><label htmlFor="reset-database">Reset Database</label></motion.button>
            </div>
               
        </div>
    );
};

export default SettingsTable;