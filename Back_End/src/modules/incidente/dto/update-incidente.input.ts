import { InputType, Field, ID } from '@nestjs/graphql'

/**
 * DTO para atualizar um Incidente
 */
@InputType()
export class UpdateIncidenteInput {
    @Field(() => ID)
    id!: string
    machineName?: string // MAQUINA_01 | MAQUINA_02 | MAQUINA_03 | MAQUINA_04 | MAQUINA_05

    @Field({ nullable: true })
    status?: string // EM_ABERTO | CONCLUIDO

    @Field(() => Date, { nullable: true })
    finishedAt?: Date
}