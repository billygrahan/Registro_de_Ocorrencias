import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { IncidenteModule } from './modules/incidente/incidente.module'
import { AuthModule } from './modules/auth/auth.module'
import { AppController } from './app.controller'
import { join } from 'path'

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
            // context: ({ req, res }) => ({ req, res }),
            // cors: {
            //     origin: ['http://localhost:3666', 'http://localhost:3000'],
            //     credentials: true,
            // },
        }),
        AuthModule,
        IncidenteModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
