import type { NextApiRequest, NextApiResponse } from 'next'
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Registro de Ocorrências - API',
            version: '1.0.0',
            description:
                'API GraphQL para gerenciamento de registros de ocorrências de manutenção',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Incidente: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único do incidente',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação do incidente',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização do incidente',
                        },
                    },
                    required: ['id', 'createdAt', 'updatedAt'],
                },
            },
        },
    },
    apis: ['./src/pages/api/*.ts'],
}

const specs = swaggerJsdoc(options)

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(specs)
    } else {
        res.status(405).end()
    }
}
