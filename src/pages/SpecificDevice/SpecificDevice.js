import React from 'react'
import { useParams } from 'react-router-dom'

const SpecificDevice = () => {
    const {id} = useParams();
    return (
        <div className='page'>
            {id}
        </div>
    )
}

export default SpecificDevice
