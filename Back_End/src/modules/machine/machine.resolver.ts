import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Machine } from './entities/machine.entity'
import { CreateMachineInput, UpdateMachineInput } from './dto'
import { MachineService } from './machine.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Resolver(() => Machine)
export class MachineResolver {
    constructor(private readonly machineService: MachineService) { }

    /**
     * Query: Buscar todas as máquinas
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Machine], { description: 'Retorna todas as máquinas' })
    async machines(): Promise<Machine[]> {
        return this.machineService.findAll()
    }

    /**
     * Query: Buscar uma máquina por ID
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => Machine, {
        nullable: true,
        description: 'Busca uma máquina específica por ID',
    })
    async machine(@Args('id', { type: () => ID }) id: string): Promise<Machine> {
        return this.machineService.findById(id)
    }

    /**
     * Query: Buscar máquinas por setor
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Machine], { description: 'Busca máquinas por setor' })
    async machinesBySetor(@Args('setor') setor: string): Promise<Machine[]> {
        return this.machineService.findBySetor(setor)
    }

    /**
     * Query: Buscar máquinas por status
     */
    @UseGuards(JwtAuthGuard)
    @Query(() => [Machine], { description: 'Busca máquinas por status' })
    async machinesByStatus(@Args('status') status: boolean): Promise<Machine[]> {
        return this.machineService.findByStatus(status)
    }

    /**
     * Mutation: Criar uma nova máquina
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Machine, { description: 'Cria uma nova máquina' })
    async criarMachine(
        @Args('input') createMachineInput: CreateMachineInput,
    ): Promise<Machine> {
        return this.machineService.create(createMachineInput)
    }

    /**
     * Mutation: Atualizar uma máquina
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Machine, {
        nullable: true,
        description: 'Atualiza uma máquina existente',
    })
    async atualizarMachine(
        @Args('input') updateMachineInput: UpdateMachineInput,
    ): Promise<Machine> {
        return this.machineService.update(updateMachineInput.id, updateMachineInput)
    }

    /**
     * Mutation: Deletar uma máquina
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean, { description: 'Deleta uma máquina' })
    async deletarMachine(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.machineService.delete(id)
    }

    /**
     * Mutation: Alternar status de uma máquina
     */
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Machine, {
        description: 'Alterna o status (ligada/desligada) de uma máquina',
    })
    async alternarStatusMachine(@Args('id', { type: () => ID }) id: string): Promise<Machine> {
        return this.machineService.toggleStatus(id)
    }
}
