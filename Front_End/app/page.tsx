'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'

export default function Home() {
    const router = useRouter()
    const { token, isLoading } = useAuthContext()

    useEffect(() => {
        if (isLoading) return

        if (token) {
            router.push('/painel')
        } else {
            router.push('/login')
        }
    }, [isLoading, token, router])

    return null
}
