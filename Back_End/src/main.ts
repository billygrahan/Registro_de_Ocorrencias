import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: ['http://localhost:3666'],
        credentials: true,
    })
    await app.listen(3333)
    console.log('🚀 Servidor rodando em http://localhost:3333/graphql')
}

bootstrap()
