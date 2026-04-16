import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class AuthPayload {
    @Field()
    accessToken!: string
}

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => AuthPayload, { description: 'Fazer login com credenciais' })
    async login(
        @Args('username') username: string,
        @Args('password') password: string,
    ): Promise<AuthPayload> {
        return this.authService.login({ username, password })
    }
}
