import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Tool } from './herramientas/tools'

@Controller()
export class AppController {

    @Get('tools')
    getTools() {
        return {
            tool: Object.values(Tool),
        }
    }
}
