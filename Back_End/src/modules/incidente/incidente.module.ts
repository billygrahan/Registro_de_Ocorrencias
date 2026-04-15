import { Module } from '@nestjs/common'
import { IncidenteService } from './incidente.service'
import { IncidenteResolver } from './incidente.resolver'
import { PrismaService } from '../../prisma/prisma.service'

/**
 * IncidenteModule
 * Módulo encapsulado para a entidade Incidente
 * Exporta resolver, service e suas dependências
 */
@Module({
    providers: [IncidenteResolver, IncidenteService, PrismaService],
    exports: [IncidenteService],
})
export class IncidenteModule { }
