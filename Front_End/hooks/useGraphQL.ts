'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { graphqlRequest } from '@/lib/graphql'

interface UseGraphQLReturn<T> {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useGraphQL<T>(query: string, variables?: Record<string, any>): UseGraphQLReturn<T> {
    const { token } = useAuth()
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refetch = useCallback(async () => {
        if (!token) return

        setLoading(true)
        setError(null)

        try {
            const result = await graphqlRequest(query, variables, token)
            setData(result as T)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao buscar dados'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [query, variables, token])

    useEffect(() => {
        if (token) {
            refetch()
        }
    }, [token, refetch])

    return { data, loading, error, refetch }
}
