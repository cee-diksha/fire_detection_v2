import { Modal } from "@mui/material"
import { useState } from "react"

const MarkFault = ({open, handleClose}) => {
    const [reason, setReason] = useState("")
  
    const submit = () => {
      if(reason!=="") {
        handleClose(false)
    //     setDeviceInfo(prev => prev.map(device => {
    //     if (device.node_id === item.node_id) return {...device, status: ["deleted"], isDeleted: true, faultReason: reason}
    //     return device
    //   }))
    } 
    }
  
    const cancel = () => {
      handleClose(false)
    }
  
    const handleInput = (event) => {
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
        >
        <div>
            <h6 >Provide a reason for the fault in the selected device. <br></br> This information will help in troubleshooting and resolving the issue more effectively.</h6>
            <input type="text" onChange={handleInput} />
            <div>
            <button onClick={submit}>Submit</button>
            <button onClick={cancel}>Cancel</button>
            </div>
        </div>
      </Modal>
     </>
    )
  }

  export default MarkFault