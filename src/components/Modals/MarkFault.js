import { Modal } from "@mui/material"
import { useState } from "react"
import './MarkFault.css'

const MarkFault = ({open, handleClose}) => {
    const [reason, setReason] = useState("")
  
    const submit = (e) => {
      handleTouch(e)
      if(reason!=="") {
        handleClose(false)
    //     setDeviceInfo(prev => prev.map(device => {
    //     if (device.node_id === item.node_id) return {...device, status: ["deleted"], isDeleted: true, faultReason: reason}
    //     return device
    //   }))
    } 
    }
    const handleTouch = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    const cancel = (e) => {
      handleTouch(e)
      handleClose(false)
    }
  
    const handleInput = (event) => {
      handleTouch(event)
      setReason(event.target.value)
    }
  
    return (
     <>
     <Modal
        className='fault-modal'
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClick={handleTouch}
        >
        <div className="md-mn flex-center-col">
            <h6 >Provide a reason for the fault in the selected device. <br>
            </br> <span className="modal-light">This information will help in troubleshooting and resolving the issue more effectively.</span></h6>
            <input type="text" onChange={handleInput} onClick={handleTouch}/>
            <div className="modal-bttn-container flex-center-row">
              <button id="modal-bttn" className="bttn-mn" onClick={submit}>Submit</button>
              <button id="modal-bttn" className="bttn-mn" onClick={cancel}>Cancel</button>
            </div>
        </div>
      </Modal>
     </>
    )
  }

  export default MarkFault