import { prisma } from '@/lib/prisma'
import { CreateIncidenteInput, UpdateIncidenteInput } from './dto'

/**
 * IncidenteService
 * Contém a lógica de negócio para a entidade Incidente
 * Interage com o Prisma Client para acesso aos dados
 */
export class IncidenteService {
    /**
     * Busca todos os incidentes
     */
    async findAll() {
        return prisma.incidente.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    /**
     * Busca um incidente por ID
     */
    async findById(id: string) {
        return prisma.incidente.findUnique({
            where: { id },
        })
    }

    /**
     * Cria um novo incidente
     */
    async create(data: CreateIncidenteInput) {
        return prisma.incidente.create({
            data: {
                // Mapear os dados de entrada para o schema do Prisma
                // Exemplo:
                // titulo: data.titulo,
                // descricao: data.descricao,
            },
        })
    }

    /**
     * Atualiza um incidente
     */
    async update(id: string, data: UpdateIncidenteInput) {
        return prisma.incidente.update({
            where: { id },
            data: {
                // Mapear os dados de entrada para o schema do Prisma
            },
        })
    }

    /**
     * Deleta um incidente
     */
    async delete(id: string) {
        return prisma.incidente.delete({
            where: { id },
        })
    }
}

// Singleton
export const incidenteService = new IncidenteService()
