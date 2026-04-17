'use client'

import { useState, useCallback, useEffect } from 'react'
import { graphqlRequest } from '@/lib/graphql'

interface UseAuthReturn {
    token: string | null
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    isLoading: boolean
    error: string | null
}

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`

export function useAuth(): UseAuthReturn {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    // Carregar token do localStorage ao montar
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken')
        if (storedToken) {
            setToken(storedToken)
        }
        setIsMounted(true)
    }, [])

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await graphqlRequest(LOGIN_MUTATION, {
                username,
                password,
            })

            const accessToken = response.login?.accessToken
            if (!accessToken) {
                throw new Error('Token não recebido')
            }

            localStorage.setItem('authToken', accessToken)
            setToken(accessToken)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao fazer login'
            console.error('❌ Login falhou:', message)
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('authToken')
        setToken(null)
        setError(null)
    }, [])

    return {
        token,
        isAuthenticated: isMounted && !!token,
        login,
        logout,
        isLoading,
        error,
    }
}
