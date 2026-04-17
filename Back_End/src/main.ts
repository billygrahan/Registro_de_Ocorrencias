import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { json } from 'express'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.use(json({ limit: '50mb' }))

    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight', 'x-apollo-operation-name'],
    })

    await app.listen(3333)
}

bootstrap()
