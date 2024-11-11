import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger'
import { Logger } from '@nestjs/common'

async function bootstrap() {
    const PORT = process.env.PORT || 3000
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders:
            'Content-Type,Authorization,X-Requested-With,Accept-Language',
        optionsSuccessStatus: 204,
        credentials: true,
    })

    const config = new DocumentBuilder().setTitle('ProjectMap API').build()
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    }
    const document = SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup('docs', app, document, {
        customCssUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.js',
        ],
    })

    await app.listen(PORT)
    Logger.log(
        `Swagger is available at http://localhost:${PORT}/docs`,
        'Bootstrap'
    )
}

bootstrap()
