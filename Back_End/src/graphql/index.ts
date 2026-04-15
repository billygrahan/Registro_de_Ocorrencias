import { IncidenteModule } from '@/modules/Incidente'

/**
 * Centraliza as definições GraphQL de todos os módulos
 */

export const typeDefs = [IncidenteModule.graphql.typeDefs]

export const resolvers = [IncidenteModule.graphql.resolvers]
