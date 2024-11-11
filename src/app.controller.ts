import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Tool } from './herramientas/tools'

@ApiTags('Tools')
@Controller()
export class AppController {
    @Get('tools')
    @ApiOperation({ summary: 'Retrieve available tools' })
    @ApiResponse({
        status: 200,
        description: 'List of available tools',
        schema: {
            example: {
                tool: ['Tool1', 'Tool2', 'Tool3'],
            },
        },
    })
    getTools() {
        return {
            tool: Object.values(Tool),
        }
    }
}
