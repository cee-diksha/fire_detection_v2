import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MainContext } from '../../context/MainContext';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setIsLogin} = useContext(MainContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(username, password, "is login check")
      if(password === "admin" && username === "admin") {
        setIsLogin(true)
        localStorage.setItem("password", password)
        navigate("/")
      }
  };

  return (
    <div className='page'>
      <form>
        <h2>Login</h2>
        <div>
            <label>Username</label>
            <input 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required 
            />
        </div>
        <div>
            <label>Password</label>
            <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
        </div>
        <button type="submit" onClick={handleSubmit}>Login</button>
      </form>
    </div>
  )
}

export default Login
