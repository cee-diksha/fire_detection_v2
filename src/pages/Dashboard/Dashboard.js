import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import AlertLedger from '../../components/AlertLedger/AlertLedger'
import AlertTray from '../../components/AlertTray/AlertTray'
import StatusDeckGlance from '../../components/StatusDeckGlance/StatusDeckGlance'
import { BatteryChart, SmokeChart, TempChart } from '../../components/Charts/Charts'
import fakeCardData from '../../data/fakeCardData.json'

const Dashboard = () => {
  const [data, setdata] = useState([])

  useEffect(()=>{
    setdata(fakeCardData)
  },[])

  return (       
    <div className='page'>
    <div className='width-100 flex-space-row'>
      <div className='db-secondary flex-start-col'>
        <StatusDeckGlance data={data}/>
        <TempChart data={data}/> 
        <BatteryChart data={data}/>
        <SmokeChart data={data}/>       
      </div>

      <div className='flex-start-col db-primary'>
        {/* Alert ledger */}
        <AlertLedger/>
        <AlertTray/>
          
      </div>  
    </div>    
  </div>
  )
}

export default Dashboard;
