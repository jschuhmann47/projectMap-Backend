import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger'

async function bootstrap() {
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

    await app.listen(process.env.PORT || 3000)
}

bootstrap()
