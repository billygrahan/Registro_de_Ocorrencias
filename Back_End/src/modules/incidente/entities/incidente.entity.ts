import { Field, ID, ObjectType } from '@nestjs/graphql'

/**
 * Entidade Incidente - representa a estrutura de dados no banco
 * Utiliza decorators do @nestjs/graphql
 */
@ObjectType()
export class Incidente {
    @Field(() => ID)
    id!: string

    @Field()
    description!: string

    @Field()
    tipo!: string // PREVENTIVA | CORRETIVA | PLANEJADA

    @Field()
    machineName!: string // MAQUINA_01 | MAQUINA_02 | MAQUINA_03 | MAQUINA_04 | MAQUINA_05

    @Field()
    status!: string // EM_ABERTO | CONCLUIDO

    @Field()
    createdAt!: Date

    @Field(() => Date, { nullable: true })
    finishedAt?: Date

    @Field()
    updatedAt!: Date
}
