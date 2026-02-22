import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token')
            if (savedToken) {
                try {
                    const { data } = await getMe()
                    setUser(data)
                } catch {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    setToken(null)
                }
            }
            setLoading(false)
        }
        initAuth()
    }, [])

    const loginUser = (tokenData, userData) => {
        localStorage.setItem('token', tokenData)
        localStorage.setItem('user', JSON.stringify(userData))
        setToken(tokenData)
        setUser(userData)
    }

    const logoutUser = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export default AuthContext
