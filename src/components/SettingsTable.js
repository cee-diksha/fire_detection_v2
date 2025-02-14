import React, { useState } from 'react';
import { socket } from "../Socket.js";
// import Switch from '@mui/material/Switch'; 

const SettingsTable = React.memo(({tableData}) => {
    const [showModal, setShowModal] = useState(false);
    const [replaced, setReplaced] = useState({})
    const [updatedData, setUpdatedData] = useState(tableData) //saving the table data in a local state to update the details whenever user makes any change


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

    const saveSpecificDeviceData = (nodeid) => {
        //  to send data of a specific device to the socket
        const data = updatedData.filter(item => item.nodeid === nodeid)
        socket.emit("ws", {data})
    }

    const saveChanges = () => {
        // to save the whole table 

        // console.log(data, "checking dataa");
        // handleReplace()
        // setDeviceInfo(data);
        updatedData.forEach(row => {
            socket.emit("ws", row)
        })
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
            <div id="btn-wrapper-table">
                <button id="save-changes" onClick={saveChanges}>Save Changes</button>
                <button onClick={() => setShowModal(true)}>Reset Database</button>
            </div>
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
                            <td>{item.nodeid}</td>
                            <td style={{ textTransform: "capitalize" }}>{item.nodetype}</td>
                            <td>
                                {/* <input
                                    type="text"
                                    style={{ width: "60%" }}
                                    defaultValue={item.axis}
                                    onChange={(e) => handleFieldChange(item.nodeid, 'axis', e.target.value)}
                                    disabled={item.isDeleted}
                                /> */}
                            </td>
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
                                {item.temp === null ? "NA" :   <>
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
                                    // <Switch
                                    //     sx={{
                                    //         '& .MuiSwitch-thumb': { backgroundColor: "#3F3F3F" },
                                    //         '& .MuiSwitch-track': { backgroundColor: "#3F3F3F" }
                                    //     }}
                                    //     checked={item.smoke}
                                    //     onChange={() => handleSwitchChange(item.nodeid, 'smoke')}
                                    //     disabled={item.isDeleted || item.nodetype === 'repeater' || item.nodetype === 'trigger unit'}
                                    // />
                                    null
                                ) : (
                                    "NA" 
                                )}
                            </td>
                            <td>
                                {item.supp !== null ? (
                                    // <Switch
                                    //     sx={{
                                    //         '& .MuiSwitch-thumb': { backgroundColor: "#3F3F3F" },
                                    //         '& .MuiSwitch-track': { backgroundColor: "#3F3F3F" }
                                    //     }}
                                    //     checked={item.supp}
                                    //     onChange={() => handleSwitchChange(item.nodeid, 'supp')}
                                    //     disabled={item.isDeleted || item.nodetype === 'repeater' || item.nodetype === 'trigger unit'}
                                    // />
                                    null
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
                                <button onClick={() => saveSpecificDeviceData(item.nodeid)}>
                                    Save
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteRow(item.nodeid)}>
                                    {item.isDeleted ? "Undo" : "Delete"}
                                </button>
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
        </div>
    );
});

export default SettingsTable;
