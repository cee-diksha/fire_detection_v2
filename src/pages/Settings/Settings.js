import React, { useEffect, useState } from 'react'
import SettingsTable from '../../components/SettingsTable';
import { socket } from '../../Socket.js';

const Settings = () => {
  const [tableData, setTableData] = useState([]) // to store table data coming from the circuit

  const fetchTableData = (payload) => {
    // func to fetch data from websocket
      setTableData((prevData) => {
        const updated = [...prevData]

        payload.forEach((newDevice) => {
          const existing = updated.findIndex((device) => device.nodeId === newDevice.nodeId)
          if(existing !== -1) {
            const existingDevice = updated[existing];

            // if anything has changed
            const hasChanged = Object.keys(newDevice).some(
              (key) => newDevice[key] !== existingDevice[key]
            );

            if (hasChanged) {
              updated[existing] = newDevice; // update only if there are changes
            }
          } else {
            updated.push(newDevice)
          }
        })
        return updated
      });
  }


  useEffect(() => {
    // the data will be fetched on initial load and when anything changes (we again get data for the ws event)
    socket.on("ws", fetchTableData)
    return () => {
      socket.off("ws", fetchTableData) // clean up to prevent overload
    };
  })

  return (
    <div>
      SETTINGS
      <SettingsTable tableData={tableData} />
    </div>
  )
}

export default Settings
