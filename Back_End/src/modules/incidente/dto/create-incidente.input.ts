import { InputType, Field, ID } from '@nestjs/graphql'

/**
 * DTO para criar um novo Incidente
 */
@InputType()
export class CreateIncidenteInput {
    @Field()
    description!: string

    @Field()
    typeOfOccurrence!: string // PREVENTIVA | CORRETIVA | PLANEJADA

    @Field(() => ID)
    machineId!: string

    @Field({ nullable: true })
    severity?: string // BAIXA | MEDIA | ALTA
}