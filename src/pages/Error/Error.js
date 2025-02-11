import React from 'react'
import './Error.css'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='err-pg-main'>
      <div className="err-pg-cont">
        <div className="err-txt">
            <h1>SOMETHING WENT WRONG</h1>
            <h4>404 PAGE NOT FOUND</h4> 
        </div>
            
      </div>
      <Link to="/">
        <span className='to-home'>HOME</span>
      </Link>
    </div>
  )
}

export default ErrorPage
