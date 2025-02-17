import React from 'react'
import StatusGlance from '../StatusGlance/StatusGlance'
import DeckGlance from '../DeckGlance/DeckGlance'
import './StatusDeckGlance.css'

const StatusDeckGlance = ({data}) => {
  return (
    <div className='sdg-mn width-100 flex-center-row'>
        <StatusGlance data={data}/>
        <DeckGlance data={data}/>      
    </div>
  )
}

export default StatusDeckGlance
