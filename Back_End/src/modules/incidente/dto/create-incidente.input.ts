import { InputType, Field } from '@nestjs/graphql'

/**
 * DTO para criar um novo Incidente
 */
@InputType()
export class CreateIncidenteInput {
    @Field()
    description!: string

    @Field()
    tipo!: string // PREVENTIVA | CORRETIVA | PLANEJADA

    @Field()
    machineName!: string // MAQUINA_01 | MAQUINA_02 | MAQUINA_03 | MAQUINA_04 | MAQUINA_05
}