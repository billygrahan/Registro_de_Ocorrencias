import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from './auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context)
        const { req } = gqlContext.getContext()

        const authHeader = req.headers.authorization
        if (!authHeader) {
            throw new UnauthorizedException('Token não fornecido')
        }

        const token = authHeader.replace('Bearer ', '')
        const payload = await this.authService.validateToken(token)

        if (!payload) {
            throw new UnauthorizedException('Token inválido ou expirado')
        }

        req.user = payload
        return true
    }
}
