import { Modal } from "@mui/material"
import { useState } from "react"
import './MarkFault.css'

const SuppressorToggle = ({open, handleClose}) => {
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
            <div>
            <h6 >Enter Access Code</h6>
            <span className="modal-light">Provide credentials to toggle suppressor.</span>
            </div>
            <input type="text" onChange={handleInput} onClick={handleTouch}/>
            <div className="modal-bttn-container flex-center-row">
              <button id="modal-bttn" className="bttn-mn" onClick={submit}><label>Submit</label></button>
              <button id="modal-bttn" className="bttn-mn" onClick={cancel}><label>Cancel</label></button>
            </div>
        </div>
      </Modal>
     </>
    )
  }

  export default SuppressorToggle