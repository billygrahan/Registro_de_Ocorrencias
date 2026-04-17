import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateMachineInput, UpdateMachineInput } from './dto'
import { Machine } from './entities/machine.entity'

@Injectable()
export class MachineService {
    constructor(private prisma: PrismaService) { }

    /**
     * Mapeia dados do Prisma para GraphQL Machine
     */
    private mapToGraphQL(item: any): Machine {
        return {
            id: item.id,
            name: item.name,
            setor: item.setor,
            status: item.status,
        }
    }

    /**
     * Busca todas as máquinas
     */
    async findAll(): Promise<Machine[]> {
        const result = await this.prisma.machine.findMany()
        return result.map((item: any) => this.mapToGraphQL(item))
    }

    /**
     * Busca uma máquina por ID
     */
    async findById(id: string): Promise<Machine> {
        const result = await this.prisma.machine.findUnique({
            where: { id },
        })
        return this.mapToGraphQL(result as any)
    }

    /**
     * Busca máquinas por setor
     */
    async findBySetor(setor: string): Promise<Machine[]> {
        const result = await this.prisma.machine.findMany({
            where: { setor: setor as any },
        })
        return result.map((item: any) => this.mapToGraphQL(item))
    }

    /**
     * Busca máquinas por status
     */
    async findByStatus(status: boolean): Promise<Machine[]> {
        const result = await this.prisma.machine.findMany({
            where: { status },
        })
        return result.map((item: any) => this.mapToGraphQL(item))
    }

    /**
     * Cria uma nova máquina
     */
    async create(createMachineInput: CreateMachineInput): Promise<Machine> {
        const result = await this.prisma.machine.create({
            data: {
                name: createMachineInput.name,
                setor: createMachineInput.setor as any,
                status: createMachineInput.status ?? true,
            },
        })
        return this.mapToGraphQL(result as any)
    }

    /**
     * Atualiza uma máquina
     */
    async update(id: string, updateMachineInput: UpdateMachineInput): Promise<Machine> {
        const updateData: any = {}

        if (updateMachineInput.name !== undefined) updateData.name = updateMachineInput.name
        if (updateMachineInput.setor !== undefined) updateData.setor = updateMachineInput.setor as any
        if (updateMachineInput.status !== undefined) updateData.status = updateMachineInput.status

        const result = await this.prisma.machine.update({
            where: { id },
            data: updateData,
        })
        return this.mapToGraphQL(result as any)
    }

    /**
     * Deleta uma máquina
     */
    async delete(id: string): Promise<boolean> {
        try {
            const exists = await this.prisma.machine.findUnique({
                where: { id },
            })

            if (!exists) {
                throw new Error(`Máquina com ID ${id} não encontrada`)
            }

            await this.prisma.machine.delete({
                where: { id },
            })

            return true
        } catch (error) {
            throw error
        }
    }

    /**
     * Alterna o status de uma máquina (ligada/desligada)
     */
    async toggleStatus(id: string): Promise<Machine> {
        const machine = await this.prisma.machine.findUnique({
            where: { id },
        })

        if (!machine) {
            throw new Error(`Máquina com ID ${id} não encontrada`)
        }

        const result = await this.prisma.machine.update({
            where: { id },
            data: {
                status: !machine.status,
            },
        })

        return this.mapToGraphQL(result as any)
    }
}
