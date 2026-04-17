'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
    username: string | null
    token: string | null
    isAuthenticated: boolean
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken')
        if (storedToken) {
            setToken(storedToken)
            setIsAuthenticated(true)

            try {
                const decoded: any = jwtDecode(storedToken)
                setUsername(decoded.username || null)
            } catch (error) {
                console.error('❌ Token inválido')
                logout()
            }
        }
        setIsLoading(false)
    }, [])

    const logout = () => {
        localStorage.removeItem('authToken')
        setToken(null)
        setUsername(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ username, token, isAuthenticated, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
    }
    return context
}
