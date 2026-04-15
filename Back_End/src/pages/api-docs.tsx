'use client'

import React, { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocs() {
    const [specs, setSpecs] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/swagger')
            .then((res) => res.json())
            .then((data) => {
                setSpecs(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Erro ao carregar specifications:', err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div style={{ padding: '2rem' }}>Carregando documentação...</div>
    }

    if (!specs) {
        return (
            <div style={{ padding: '2rem' }}>
                Erro ao carregar a documentação da API
            </div>
        )
    }

    return <SwaggerUI spec={specs} />
}
