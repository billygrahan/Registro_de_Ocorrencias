import { ApolloServer } from 'apollo-server-micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import { typeDefs, resolvers } from '@/graphql'

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const startServer = server.start()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
        'Access-Control-Allow-Origin',
        req.headers.origin || '*'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    await startServer

    await server.createHandler({
        path: '/api/graphql',
    })(req, res)
}

export const config = {
    api: {
        bodyParser: false,
    },
}
