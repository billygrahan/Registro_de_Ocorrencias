import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

interface LoginInput {
    username: string
    password: string
}

interface AuthPayload {
    sub: string
    username: string
    iat: number
    exp: number
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateCredentials(username: string, password: string): Promise<boolean> {
        const validUsername = this.configService.get('AUTH_USERNAME')
        const validPassword = this.configService.get('AUTH_PASSWORD')
        return username === validUsername && password === validPassword
    }

    async login(credentials: LoginInput): Promise<{ accessToken: string }> {
        const isValid = await this.validateCredentials(credentials.username, credentials.password)

        if (!isValid) {
            throw new Error('Credenciais inválidas')
        }

        const payload = { sub: '1', username: credentials.username }
        const accessToken = this.jwtService.sign(payload)

        return {
            accessToken,
        }
    }

    async validateToken(token: string): Promise<AuthPayload | null> {
        try {
            return this.jwtService.verify(token) as AuthPayload
        } catch {
            return null
        }
    }
}
