import { ReactNode, createContext, useState } from 'react'

enum LoginEnum {
    SIGN_IN = 'SIGN_IN',
    LOG_IN = 'LOG_IN',
}

interface AuthState {
    isAuth: boolean
    user: any
    error: any
}

interface IAuthContext {
    state: AuthState
    setAuthState: ({ isAuth, user, error }: AuthState) => void
}

const authContext: IAuthContext = {
    state: {
        isAuth: false,
        user: {},
        error: {},
    },
    setAuthState: () => {},
}

export const AuthContext = createContext<IAuthContext>(authContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuth: false,
        user: null,
        error: null,
    })

    const onAuthState = ({ isAuth, user, error }: AuthState) => {
        setAuthState({ isAuth, user, error })
    }

    const authContextValue: IAuthContext = {
        state: authState,
        setAuthState: onAuthState,
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    )
}
