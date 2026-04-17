import { InputType, Field, ID } from '@nestjs/graphql'

/**
 * DTO para atualizar uma Máquina
 */
@InputType()
export class UpdateMachineInput {
    @Field(() => ID)
    id!: string

    @Field({ nullable: true })
    name?: string

    @Field({ nullable: true })
    setor?: string // PRODUCAO | USINAGEM | TELHAGEM

    @Field({ nullable: true })
    status?: boolean
}
