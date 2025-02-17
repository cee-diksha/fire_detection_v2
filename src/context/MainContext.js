import { createContext, useEffect, useState } from "react";

const MainContext = createContext()

const MainContextProvider = (props) => {

    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        //  to automatically login when the password entered matches the localStorage
        if (localStorage.getItem("password") === "admin") setIsLogin(true)
        // to set the password in localStorage to null when the user logs out
        if (isLogin === false) localStorage.setItem("password", null)
    }, [isLogin])

    return (
        <MainContext.Provider
            value={{
                isLogin,
                setIsLogin,
            }}>
            {props.children}
        </MainContext.Provider>
    )
}

export {MainContext, MainContextProvider}