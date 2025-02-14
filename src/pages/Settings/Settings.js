import React, { useEffect, useState } from 'react'
import SettingsTable from '../../components/SettingsTable';
import { socket } from '../../Socket.js';
import { SettingCards } from './SettingCards.js';

const Settings = () => {
  const [tableData, setTableData] = useState([]) // to store table data coming from the circuit
  const [deviceTotal, setDeviceTotal] = useState()

  const fetchTableData = (info) => {
    const cardDetails = info.settingparameter
    setDeviceTotal(info.quantity)

    console.log(Object.values(cardDetails), "values check")

    // func to fetch data from websocket
      setTableData((prevData) => {
        const updated = [...prevData]

        cardDetails.forEach((newDevice) => {
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


  
  // this is just for testing purpose
  useEffect(() => {
    setDeviceTotal({R:2, S: 10, T: 10})
    const cardDetails = {
      3:{nodeid:3, nodetype:"Repeater", deckno :"1", compno:"1", status:"Normal", temp:60, smoke:"checked", lastupdate:"unknown", statuscode:0, location:"unknown", batp:80, parentid:0, parentpipe:2,supp:null, replacedby:-1, lastpid:1, slave:0, path:[3], length:1, tempvalue:-1, connectedto:0}, 
      4:{nodeid:4, nodetype:"Repeater", deckno :"2", compno:"4", status:"Normal", temp:60, smoke:"checked", lastupdate:"unknown", statuscode:0, location:"unknown", batp:80, parentid:0, parentpipe:2,supp:null, replacedby:-1, lastpid:1, slave:0, path:[3], length:1, tempvalue:-1, connectedto:0}
    }
    setTableData(Object.values(cardDetails))
  }, [])

  

  return (
    <div>
      SETTINGS
      {deviceTotal !== undefined && <SettingCards totalDevices={deviceTotal} />}
      {tableData.length !== 0 && <SettingsTable tableData={tableData} />}
    </div>
  )
}

export default Settings
