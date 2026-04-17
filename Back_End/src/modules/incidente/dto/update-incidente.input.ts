import { InputType, Field, ID } from '@nestjs/graphql'

/**
 * DTO para atualizar um Incidente
 */
@InputType()
export class UpdateIncidenteInput {
    @Field(() => ID)
    id!: string
    machineName?: string // RTX5090 | R75800X3D | SSDSATA | SSDNVME | RAMDDR43200MHZ

    @Field({ nullable: true })
    status?: string // EM_ABERTO | CONCLUIDO

    @Field(() => Date, { nullable: true })
    finishedAt?: Date
}