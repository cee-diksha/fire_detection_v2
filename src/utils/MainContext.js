import { createContext, useState } from "react";

const MainContext = createContext()

const MainContextProvider = (props) => {

    const [isLogin, setIsLogin] = useState(false)

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