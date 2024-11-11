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
        description: 'Returns a list of available tools with their identifiers',
        schema: {
            type: 'object',
            properties: {
                tool: {
                    type: 'array',
                    items: {
                        enum: Object.values(Tool),
                    },
                    description:
                        'List of tool identifiers available in the system',
                },
            },
        },
    })
    getTools() {
        return {
            tool: Object.values(Tool),
        }
    }
}
