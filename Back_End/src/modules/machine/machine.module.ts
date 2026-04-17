import { Module } from '@nestjs/common'
import { MachineResolver } from './machine.resolver'
import { MachineService } from './machine.service'
import { PrismaService } from '../../prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [AuthModule],
    providers: [MachineResolver, MachineService, PrismaService],
    exports: [MachineService],
})
export class MachineModule { }
