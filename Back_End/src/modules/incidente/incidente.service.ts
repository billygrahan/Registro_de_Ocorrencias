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
            tipo: item.tipo,
            machineName: item.machineName,
            status: item.status,
            createdAt: item.createdAt,
            finishedAt: item.finishedAt || undefined,
            updatedAt: item.updatedAt,
        }
    }

    /**
     * Busca todos os incidentes
     */
    async findAll(): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        return result.map(item => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca um incidente por ID
     */
    async findById(id: string): Promise<Incidente> {
        const result = await this.prisma.incidente.findUnique({
            where: { id },
        })
        return this.mapToGraphQL(result) as Incidente
    }

    /**
     * Busca incidentes por status
     */
    async findByStatus(status: string): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            where: { status: status as any },
            orderBy: { createdAt: 'desc' },
        })
        return result.map(item => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca incidentes por tipo
     */
    async findByTipo(tipo: string): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            where: { tipo: tipo as any },
            orderBy: { createdAt: 'desc' },
        })
        return result.map(item => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Busca incidentes por máquina
     */
    async findByMachineName(machineName: string): Promise<Incidente[]> {
        const result = await this.prisma.incidente.findMany({
            where: { machineName: machineName as any },
            orderBy: { createdAt: 'desc' },
        })
        return result.map(item => this.mapToGraphQL(item)) as Incidente[]
    }

    /**
     * Cria um novo incidente
     */
    async create(createIncidenteInput: CreateIncidenteInput): Promise<Incidente> {
        const result = await this.prisma.incidente.create({
            data: {
                description: createIncidenteInput.description,
                tipo: createIncidenteInput.tipo as any,
                machineName: createIncidenteInput.machineName as any,
                status: 'EM_ABERTO' as any,
            },
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
        if (updateIncidenteInput.tipo !== undefined) updateData.tipo = updateIncidenteInput.tipo
        if (updateIncidenteInput.machineName !== undefined)
            updateData.machineName = updateIncidenteInput.machineName
        if (updateIncidenteInput.status !== undefined) updateData.status = updateIncidenteInput.status
        if (updateIncidenteInput.finishedAt !== undefined)
            updateData.finishedAt = updateIncidenteInput.finishedAt

        const result = await this.prisma.incidente.update({
            where: { id },
            data: updateData,
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
