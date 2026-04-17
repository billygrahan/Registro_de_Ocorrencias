import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3666'
    app.enableCors({
        origin: [frontendUrl],
        credentials: true,
    })
    await app.listen(3333)
}

bootstrap()
