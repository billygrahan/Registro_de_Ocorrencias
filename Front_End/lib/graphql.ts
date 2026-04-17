export async function graphqlRequest(
    query: string,
    variables?: Record<string, any>,
    token?: string
) {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3333/graphql'

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apollo-require-preflight': 'true',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables: variables || {},
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = await response.json()

        if (data.errors) {
            console.error('❌ GraphQL Error:', data.errors[0]?.message)
            throw new Error(data.errors[0]?.message || 'GraphQL Error')
        }

        return data.data
    } catch (error) {
        console.error('❌ Request failed:', error instanceof Error ? error.message : String(error))
        throw error
    }
}
