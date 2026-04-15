import { incidenteResolvers, incidenteTypeDefs } from './IncidenteResolver'
import { IncidenteService, incidenteService } from './IncidenteService'
import { CreateIncidenteInput, UpdateIncidenteInput, IncidenteOutput } from './dto'
import { Incidente, IIncidente } from './entities'

/**
 * IncidenteModule
 * Módulo responsável por exportar todos os elementos da entidade Incidente
 * - DTOs (Data Transfer Objects)
 * - Entidades (Entity Classes)
 * - GraphQL (Type Definitions e Resolvers)
 * - Services (Business Logic)
 */

export const IncidenteModule = {
    // Type Definitions e Resolvers do GraphQL
    graphql: {
        typeDefs: incidenteTypeDefs,
        resolvers: incidenteResolvers,
    },

    // Serviço com a lógica de negócio
    service: incidenteService,
    ServiceClass: IncidenteService,

    // DTOs
    dto: {
        CreateIncidenteInput,
        UpdateIncidenteInput,
        IncidenteOutput,
    },

    // Entidades
    entities: {
        Incidente,
        IIncidente,
    },
}

export default IncidenteModule
