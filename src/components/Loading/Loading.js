import React from 'react'
import './Loading.css'

export default function Loading(props) {
  return (
    <div className='ld-mn' style={props.height?{height:'100%'}:{}}>
      <div className='loader'></div>
    </div>
  )
}
