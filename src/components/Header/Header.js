import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LiveClock from '../LiveClock/LiveClock'
import './Header.css'
import { ExportPdfButton } from '../../utils/ExportPdfButton'
import { MainContext } from '../../context/MainContext'
import UserDropDown from '../UserDropDown/UserDropDown'
import { Tooltip } from '@mui/material'
import FullscreenButton from '../Fullscreen/FullscreenButton'
import fakeCardData from '../../data/fakeCardData.json'
import { SHIP_NAME } from '../../libs/Constants'

const Header = () => {
    const {isLogin, setIsLogin, isDemo, sendMessage, isMuteAllEnabled, setIsMuteAllEnabled} = useContext(MainContext)
    const [theme,setTheme] = useState('dark')
    const [isSettingsPg, setIsSettingsPg] = useState(false)
    const settingsRoute = ["/settings", "/login"]
    const dashboardRoute = ["/"]
    const loginRoute = ["/login"]
    const [data,setData] = useState([])

    const [isMuteDisabled, setIsMuteDisabled] = useState(false)

    const handleThemeChange =  () => {
        if(theme==="dark") {
            setTheme("light")
            document.body.classList.add('light');
        } else {
            setTheme("dark")
            document.body.classList.remove('light');
        }
    }

    useEffect(() => {
        if(window.location.pathname === "/settings"){
            setIsSettingsPg(true)
        }else{
            setIsSettingsPg(false)
        }
    }, [window.location.pathname])

    const fetchAlarmStatus = () => {
        console.log("[Header] Fetching alarm status...")
        sendMessage({ "ALARMSTATUS": 1 })
      }

    useEffect(() => {
    if (window.location.pathname === "/") {
        fetchAlarmStatus()
    }
    }, [window.location.pathname])

    const handleMuteAlarm = () => {
        if (isMuteDisabled) return 
        setIsMuteDisabled(true)
    
        const command = isMuteAllEnabled ? "MUTEALLDISABLE" : "MUTEALLENABLE"
        sendMessage({ [command]: 1 })
    
  
        setTimeout(() => {
          fetchAlarmStatus()
        }, 500)
    
        setTimeout(() => {
          setIsMuteDisabled(false)
        }, 1200)
      }
    
  return (
    <div className='header-container'>
      <div className='header-mn'>

        <div className='header-sec1'>
            {!isSettingsPg && (
                <div className='header-ship-nm'>
                    <div className='ship-logo-div'> 
                        <img src="/static/images/crest.jpg" alt="ship" />
                    </div>
                    <h2 >{SHIP_NAME}</h2>
                </div>
            )}

            {isSettingsPg && 
            (
                <div className='sttngs-time'>
                    <LiveClock />
                </div>
            )}
        </div>
            
        <div className='header-sec2'>
         

            <div className='header-search-login'>
                {/* handles mute */}
                <Tooltip title={isMuteAllEnabled ? 'Unmute All Alarms' : 'Mute All Alarms'} disableInteractive>
              <div
                className='header-icon-div'
                onClick={!isMuteDisabled ? handleMuteAlarm : undefined}
                style={{
                  cursor: isMuteDisabled ? 'default' : 'pointer',
                  opacity: isMuteDisabled ? 0.4 : 1,
                  pointerEvents: isMuteDisabled ? 'none' : 'auto'
                }}
              >
                <img
                  src={isMuteAllEnabled ? '/static/images/unmute-alarm.svg' : '/static/images/mute-alarm.svg'}
                  alt="mute-all-icon"
                />
              </div>
            </Tooltip>

                {window.location.pathname === "/" && 
                <>
                    <ExportPdfButton data={data} theme={theme}/>
                    {/* <DropDown cardData={cardData}/> */}
                </>
            }

                {/* handles theme */}
                <Tooltip title={theme==='light'?'Dark Mode':'Light Mode'} disableInteractive>
                    <div className='header-icon-div' style={{cursor:'pointer'}} onClick={handleThemeChange}>
                        <img src={theme==="dark" ? '/static/images/sun.svg' : '/static/images/moon.svg'} alt="theme-icon" />
                    </div>
                </Tooltip>

                

                {/* show settings icon */}
                {isLogin && !settingsRoute.includes(window.location.pathname) && 
                        <Link to={"/settings"}>
                            <Tooltip title="Settings" disableInteractive>
                            <div className='header-icon-div'>
                                    <img src='/static/images/settings.svg' alt="settings"/>                           
                            </div>
                            </Tooltip>
                        </Link>
                }

                {/* show dashboard icon */}
                {!dashboardRoute.includes(window.location.pathname) &&
                    <Link to="/">
                         <Tooltip title="Dashboard" disableInteractive>
                            <div className='header-icon-div'>                       
                                    <img src='/static/images/home.svg' alt='dashboard' />
                            </div>
                        </Tooltip>
                    </Link>
                }

                {/* show login icon if not logged in, otherwise show userdropdown */}
                {isLogin && !loginRoute.includes(window.location.pathname) ? 
                <UserDropDown setIsLogin = {setIsLogin} /> : 
                window.location.pathname === "/login" ? null :  
                <Link to="/login">
                    <Tooltip title="Login">
                        <div className='header-icon-div'>
                            <img src="/static/images/login.svg" alt="login"/>
                        </div>
                    </Tooltip>
                </Link>}
                
                
                <FullscreenButton/>
                
                
            </div>
        </div>
    </div>
    </div>
  )
}

export default Header