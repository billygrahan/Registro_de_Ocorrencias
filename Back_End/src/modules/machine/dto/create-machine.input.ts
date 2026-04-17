import { InputType, Field } from '@nestjs/graphql'

/**
 * DTO para criar uma nova Máquina
 */
@InputType()
export class CreateMachineInput {
    @Field()
    name!: string

    @Field()
    setor!: string // PRODUCAO | USINAGEM | TELHAGEM

    @Field({ nullable: true })
    status?: boolean // Padrão: true
}
