import { gql } from 'apollo-server-micro'
import { incidenteService } from './IncidenteService'

/**
 * GraphQL Type Definitions e Resolvers para Incidente
 */

export const incidenteTypeDefs = gql`
  type Incidente {
    id: ID!
    createdAt: String!
    updatedAt: String!
    # Adicione aqui os campos do modelo Incidente
    # Exemplo:
    # titulo: String!
    # descricao: String
    # status: String!
    # prioridade: String
  }

  type Query {
    incidentes: [Incidente!]!
    incidente(id: ID!): Incidente
  }

  type Mutation {
    createIncidente(input: CreateIncidenteInput!): Incidente!
    updateIncidente(input: UpdateIncidenteInput!): Incidente
    deleteIncidente(id: ID!): Boolean!
  }

  input CreateIncidenteInput {
    # Adicione aqui os campos de entrada para criar um Incidente
    # Exemplo:
    # titulo: String!
    # descricao: String
    # status: String!
  }

  input UpdateIncidenteInput {
    id: ID!
    # Adicione aqui os campos que podem ser atualizados
  }
`

export const incidenteResolvers = {
    Query: {
        incidentes: async () => {
            const incidentes = await incidenteService.findAll()
            return incidentes.map((incidente) => ({
                ...incidente,
                createdAt: incidente.createdAt.toISOString(),
                updatedAt: incidente.updatedAt.toISOString(),
            }))
        },

        incidente: async (_: any, { id }: { id: string }) => {
            const incidente = await incidenteService.findById(id)
            if (!incidente) return null

            return {
                ...incidente,
                createdAt: incidente.createdAt.toISOString(),
                updatedAt: incidente.updatedAt.toISOString(),
            }
        },
    },

    Mutation: {
        createIncidente: async (_: any, { input }: any) => {
            const incidente = await incidenteService.create(input)

            return {
                ...incidente,
                createdAt: incidente.createdAt.toISOString(),
                updatedAt: incidente.updatedAt.toISOString(),
            }
        },

        updateIncidente: async (_: any, { input }: any) => {
            const { id, ...data } = input
            const incidente = await incidenteService.update(id, data)

            return {
                ...incidente,
                createdAt: incidente.createdAt.toISOString(),
                updatedAt: incidente.updatedAt.toISOString(),
            }
        },

        deleteIncidente: async (_: any, { id }: { id: string }) => {
            try {
                await incidenteService.delete(id)
                return true
            } catch {
                return false
            }
        },
    },
}
