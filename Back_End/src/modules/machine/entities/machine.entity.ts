import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Machine {
    @Field(() => ID)
    id!: string

    @Field()
    name!: string

    @Field()
    setor!: string // PRODUCAO | USINAGEM | TELHAGEM

    @Field()
    status!: boolean
}
