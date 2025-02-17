import React from 'react'
import './RavenLogo.css'

const RavenLogo = () => {
  return (
    <div className='logo-head'>          
          <div className='logo-head-txt'>
            <img src="/static/images/crimson-energy-xs.svg" alt="crimson logo" />
            <div id='crimson-logo' className='logo-mn-txt'>
              <span id='crimson-logo'>Crimson Energy Experts Pvt. Ltd.</span>
            </div>
          </div>

          <div className='logo-mn'>
            <img src="/static/images/redraven-xs.svg" alt="redraven logo" />
            <div className='logo-mn-txt'>
              <span id='logo-name'>RedRaven™</span>
              <span id='logo-name-2'>Wireless Detection Systems</span>
            </div>
          </div>
    </div>
  )
}

export default RavenLogo
