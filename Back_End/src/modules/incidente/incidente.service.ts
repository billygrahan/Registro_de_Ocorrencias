import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateIncidenteInput, UpdateIncidenteInput } from './dto'
import { Incidente } from './entities/incidente.entity'

/**
 * IncidenteService
 * Contém a lógica de negócio para a entidade Incidente
 * Interage com o Prisma Client para acesso aos dados
 */
@Injectable()
export class IncidenteService {
    constructor(private prisma: PrismaService) { }

    /**
     * Mapeia dados do Prisma para GraphQL Incidente
     */
    private mapToGraphQL(item: any): Incidente {
        return {
            id: item.id,
            description: item.description,
            typeOfOccurrence: item.typeOfOccurrence,
            machine: item.machine,
            status: item.status,
            severity: item.severity || 'BAIXA',
            createdAt: item.createdAt,
            finishedAt: item.finishedAt || undefined,
        }
    }

    /**
     * Busca todos os incidentes
     */
    async findAll(): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            include: { machine: true },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return result.map((item: any) => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca um incidente por ID
     */
    async findById(id: string): Promise<Incidente> {
        const result = await this.prisma.incidente.findUnique({
            where: { id },
            include: { machine: true },
        })
        return this.mapToGraphQL(result) as Incidente
    }

    /**
     * Busca incidentes por status
     */
    async findByStatus(status: string): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            where: { status: status as any },
            include: { machine: true },
            orderBy: { createdAt: 'desc' },
        })
        return result.map((item: any) => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca incidentes por tipo de ocorrência
     */
    async findByTypeOfOccurrence(typeOfOccurrence: string): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            where: { typeOfOccurrence: typeOfOccurrence as any },
            include: { machine: true },
            orderBy: { createdAt: 'desc' },
        })
        return result.map((item: any) => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca incidentes por máquina
     */
    async findByMachineId(machineId: string): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            where: { machineId },
            include: { machine: true },
            orderBy: { createdAt: 'desc' },
        })
        return result.map((item: any) => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca os últimos N incidentes
     */
    async findLastN(limit: number = 5): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            include: { machine: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
        })
        return result.map((item: any) => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Cria um novo incidente
     */
    async create(createIncidenteInput: CreateIncidenteInput): Promise<Incidente> {
        const result = await this.prisma.incidente.create({
            data: {
                description: createIncidenteInput.description,
                typeOfOccurrence: createIncidenteInput.typeOfOccurrence as any,
                machineId: createIncidenteInput.machineId,
                status: 'EM_ABERTO' as any,
                severity: createIncidenteInput.severity || 'BAIXA' as any,
            },
            include: { machine: true },
        })
        return this.mapToGraphQL(result) as Incidente
    }

    /**
     * Atualiza um incidente
     */
    async update(id: string, updateIncidenteInput: any): Promise<Incidente> {
        const updateData: any = {}

        if (updateIncidenteInput.description !== undefined)
            updateData.description = updateIncidenteInput.description
        if (updateIncidenteInput.typeOfOccurrence !== undefined) updateData.typeOfOccurrence = updateIncidenteInput.typeOfOccurrence
        if (updateIncidenteInput.machineId !== undefined)
            updateData.machineId = updateIncidenteInput.machineId
        if (updateIncidenteInput.status !== undefined) updateData.status = updateIncidenteInput.status
        if (updateIncidenteInput.severity !== undefined) updateData.severity = updateIncidenteInput.severity
        if (updateIncidenteInput.finishedAt !== undefined)
            updateData.finishedAt = updateIncidenteInput.finishedAt

        const result = await this.prisma.incidente.update({
            where: { id },
            data: updateData,
            include: { machine: true },
        })
        return this.mapToGraphQL(result) as Incidente
    }

    /**
     * Marca um incidente como concluído
     */
    async markAsFinished(id: string): Promise<Incidente> {
        const result = await this.prisma.incidente.update({
            where: { id },
            data: {
                status: 'CONCLUIDO' as any,
                finishedAt: new Date(),
            },
            include: { machine: true },
        })
        return this.mapToGraphQL(result) as Incidente
    }

    /**
     * Deleta um incidente
     */
    async delete(id: string): Promise<boolean> {
        try {
            const exists = await this.prisma.incidente.findUnique({
                where: { id },
            })

            if (!exists) {
                throw new Error(`Incidente com ID ${id} não encontrado`)
            }

            await this.prisma.incidente.delete({
                where: { id },
            })

            return true
        } catch (error: any) {
            throw new Error(`Erro ao deletar incidente: ${error?.message}`)
        }
    }
}
