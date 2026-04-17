import { InputType, Field, ID } from '@nestjs/graphql'

/**
 * DTO para atualizar um Incidente
 */
@InputType()
export class UpdateIncidenteInput {
    @Field(() => ID)
    id!: string

    @Field({ nullable: true })
    description?: string

    @Field({ nullable: true })
    typeOfOccurrence?: string // PREVENTIVA | CORRETIVA | PLANEJADA

    @Field({ nullable: true })
    machineName?: string // RTX5090 | R75800X3D | SSDSATA | SSDNVME | RAMDDR43200MHZ

    @Field({ nullable: true })
    status?: string // EM_ABERTO | CONCLUIDO

    @Field({ nullable: true })
    severity?: string // BAIXA | MEDIA | ALTA

    @Field(() => Date, { nullable: true })
    finishedAt?: Date
}