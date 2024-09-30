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
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: "Content-Type,Authorization,X-Requested-With,Accept-Language",
        optionsSuccessStatus: 204,
        credentials: true,
      })

    const config = new DocumentBuilder().setTitle('ProjectMap API').build()
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    }
    const document = SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup('docs', app, document)

    await app.listen(process.env.PORT || 3000)
    // to print routes
    // const server = app.getHttpServer()
    // const router = server._events.request._router

    // const availableRoutes: [] = router.stack
    //     .map((layer) => {
    //         if (layer.route) {
    //             return {
    //                 route: {
    //                     path: layer.route?.path,
    //                     method: layer.route?.stack[0].method,
    //                 },
    //             }
    //         }
    //     })
    //     .filter((item) => item !== undefined)
    // const fs = require('node:fs')

    // fs.writeFile('./docs/routes.json', JSON.stringify(availableRoutes), (err) => {
    //     if (err) {
    //         console.error(err)
    //     } else {
    //         console.log('saved')
    //     }
    // })
}

bootstrap()
