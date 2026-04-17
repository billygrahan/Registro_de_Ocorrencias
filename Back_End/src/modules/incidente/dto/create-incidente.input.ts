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
    machineName!: string // RTX5090 | R75800X3D | SSDSATA | SSDNVME | RAMDDR43200MHZ
}