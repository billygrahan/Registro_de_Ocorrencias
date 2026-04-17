import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Incidente } from './entities/incidente.entity'
import { CreateIncidenteInput, UpdateIncidenteInput } from './dto'
import { IncidenteService } from './incidente.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

/**
 * IncidenteResolver
 * Define as Queries e Mutations para a entidade Incidente
 * Utiliza decorators do @nestjs/graphql
 */
@Resolver(() => Incidente)
export class IncidenteResolver {
    constructor(private readonly incidenteService: IncidenteService) { }

    /**
     * Query: Buscar todos os incidentes
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Incidente], { description: 'Retorna todos os incidentes' })
    async incidentes(): Promise<Incidente[]> {
        return this.incidenteService.findAll()
    }

    /**
     * Query: Buscar os últimos incidentes
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Incidente], { description: 'Retorna os últimos 5 incidentes' })
    async ultimosincidentes(): Promise<Incidente[]> {
        return this.incidenteService.findLastN(5)
    }

    /**
     * Query: Buscar um incidente por ID
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => Incidente, {
        nullable: true,
        description: 'Busca um incidente específico por ID',
    })
    async incidente(@Args('id', { type: () => ID }) id: string): Promise<Incidente> {
        return this.incidenteService.findById(id)
    }

    /**
     * Query: Buscar incidentes por status
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Incidente], { description: 'Busca incidentes por status' })
    async incidentesByStatus(@Args('status') status: string): Promise<Incidente[]> {
        return this.incidenteService.findByStatus(status)
    }

    /**
     * Query: Buscar incidentes por tipo
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Incidente], { description: 'Busca incidentes por tipo de ocorrência' })
    async incidentesByTypeOfOccurrence(@Args('typeOfOccurrence') typeOfOccurrence: string): Promise<Incidente[]> {
        return this.incidenteService.findByTypeOfOccurrence(typeOfOccurrence)
    }

    /**
     * Query: Buscar incidentes por máquina
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Incidente], { description: 'Busca incidentes por máquina' })
    async incidentesByMachineName(@Args('machineName') machineName: string): Promise<Incidente[]> {
        return this.incidenteService.findByMachineName(machineName)
    }

    /**
     * Mutation: Criar um novo incidente
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Incidente, { description: 'Cria um novo incidente' })
    async criarIncidente(
        @Args('input') createIncidenteInput: CreateIncidenteInput,
    ): Promise<Incidente> {
        return this.incidenteService.create(createIncidenteInput)
    }

    /**
     * Mutation: Atualizar um incidente
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Incidente, {
        nullable: true,
        description: 'Atualiza um incidente existente',
    })
    async atualizarIncidente(
        @Args('input') updateIncidenteInput: UpdateIncidenteInput,
    ): Promise<Incidente> {
        return this.incidenteService.update(updateIncidenteInput.id, updateIncidenteInput)
    }

    /**
     * Mutation: Marcar um incidente como concluído
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Incidente, {
        nullable: true,
        description: 'Marca um incidente como concluído',
    })
    async concluirIncidente(@Args('id', { type: () => ID }) id: string): Promise<Incidente> {
        return this.incidenteService.markAsFinished(id)
    }

    /**
     * Mutation: Deletar um incidente
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean, { description: 'Deleta um incidente' })
    async deletarIncidente(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.incidenteService.delete(id)
    }
}
