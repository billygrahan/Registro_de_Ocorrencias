import React from 'react'

export default function Home() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Registro de Ocorrências - Backend API</h1>

            <div style={{ marginTop: '2rem' }}>
                <h2>Endpoints disponíveis:</h2>
                <ul>
                    <li>
                        <strong>GraphQL:</strong>{' '}
                        <a href="/api/graphql">/api/graphql</a>
                    </li>
                    <li>
                        <strong>Swagger/OpenAPI:</strong>{' '}
                        <a href="/api-docs">/api-docs</a>
                    </li>
                </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Documentação:</h2>
                <p>Veja [README.md](./README.md) para mais informações.</p>
            </div>
        </div>
    )
}
