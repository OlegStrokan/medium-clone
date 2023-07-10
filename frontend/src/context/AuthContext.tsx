import { IUser } from "@/interfaces/user/IUser"
import { ReactNode, createContext, useState } from "react"

export enum LoginEnum {
    SIGN_IN = 'SIGN_IN',
    LOG_IN = 'LOG_IN'
}

export interface AuthState {
    isAuth: Boolean,
    user: IUser | null
}


export const AuthContext = createContext<AuthState>({ isAuth: false, user: null})

export const AuthProvider = ({children}:  { children: ReactNode }) => {

    const [authState, setAuthState] =  useState<AuthState>({isAuth: false, user: null});


    const onAuthState  = ({isAuth, user}: AuthState) => {
        setAuthState({ isAuth, user })
    }

    const authContextValue = {
       ...authState, setAuthState: onAuthState
    }

    return (
        <AuthContext.Provider value={authContextValue}>
        {children}
        </AuthContext.Provider>
    )
} 