import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Machine } from '../../machine/entities/machine.entity'

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
    typeOfOccurrence!: string // PREVENTIVA | CORRETIVA | PLANEJADA

    @Field(() => Machine)
    machine!: Machine

    @Field()
    status!: string // EM_ABERTO | CONCLUIDO

    @Field()
    severity!: string // BAIXA | MEDIA | ALTA

    @Field()
    createdAt!: Date

    @Field(() => Date, { nullable: true })
    finishedAt?: Date
}
