import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { IncidenteModule } from './modules/incidente/incidente.module'
import { MachineModule } from './modules/machine/machine.module'
import { AuthModule } from './modules/auth/auth.module'
import { AppController } from './app.controller'
import { join } from 'path'
import { Request } from 'express'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.local',
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            context: ({ req }: { req: Request }) => {
                return { req };
            },
        }),
        AuthModule,
        IncidenteModule,
        MachineModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
