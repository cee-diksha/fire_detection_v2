import { createContext, useState } from "react";

const MainContext = createContext()

const MainContextProvider = (props) => {

    const [isLogin, setIsLogin] = useState(true)
    const [isDemo, setIsDemo] = useState(true);

    return (
        <MainContext.Provider
            value={{
                isLogin,
                setIsLogin,
                isDemo,
                setIsDemo
            }}>
            {props.children}
        </MainContext.Provider>
    )
}

export {MainContext, MainContextProvider}