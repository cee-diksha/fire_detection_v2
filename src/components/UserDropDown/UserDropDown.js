import { Box, ClickAwayListener } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import './UserDropDown.css';

const UserDropDown = ({setIsLogin}) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen((prev) => !prev);
    };
  
    const handleClickAway = () => {
      setOpen(false);
    };
  
    const styles = {
        position: 'absolute',
        top: 60,
        right: 0,
        zIndex: 1,
        border: "none",
        borderRadius: "6px",
        p: 2,
        bgcolor: 'var(--card-clr)',
        color: "var(--text-color)",
        width: "140px"
      };
    
  return (
  
    <ClickAwayListener onClickAway={handleClickAway}>
        <div className='header-icon-div' id="drop-down" onClick={handleClick}>
            <img src='/static/images/login.svg' alt="user-img"/>
            <p>Admin</p>
            {open ? (
            <Box sx={styles}>
                <Link style={{textDecoration: "none", color: "var(--text-color)"}} to ="/user-management"><span style={{cursor: "pointer"}}>User Management</span></Link> <br></br>
                <span style={{cursor: "pointer"}} onClick={() =>setIsLogin(false)}>Logout</span>
            </Box>
            ) : null}
        </div>
    </ClickAwayListener>
    
  )
}

export default UserDropDown
