import { Module } from '@nestjs/common'
import { IncidenteService } from './incidente.service'
import { IncidenteResolver } from './incidente.resolver'
import { PrismaService } from '../../prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'

/**
 * IncidenteModule
 * Módulo encapsulado para a entidade Incidente
 * Exporta resolver, service e suas dependências
 */
@Module({
    imports: [AuthModule],
    providers: [IncidenteResolver, IncidenteService, PrismaService],
    exports: [IncidenteService],
})
export class IncidenteModule { }
