import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * PrismaService
 * Gerencia a conexão com o banco de dados MongoDB via Prisma
 */
@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super()
    }

    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
