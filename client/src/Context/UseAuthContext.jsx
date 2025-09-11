import React from "react";
import { createContext } from "react";

export const authDataContext = createContext();

const AuthContext = ({children}) => {
    const serverUrl = 'http://localhost:3000'

    let value = {
        serverUrl
    }

    return (
        <div>
            <authDataContext.Provider value={value}>
                {children}
            </authDataContext.Provider>
        </div>
    )
}

export default AuthContext;