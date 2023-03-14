import { createContext,useState } from "react";

export const globalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [data, setData] = useState([])
    return <globalContext.Provider value={{
        crypto: data,
        setCrypto:setData,
    }}>{children}</globalContext.Provider>;
};