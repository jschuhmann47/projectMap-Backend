import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common'
import { AnsoffService } from './ansoff.service'
import { Ansoff } from './ansoff.schema'
import { AnsoffDto, AnsoffProductDto } from './ansoff.dto'
import { AuthGuard } from '@nestjs/passport'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger'

@UseGuards(AuthGuard('jwt'))
@Controller('ansoff')
@ApiTags('ansoff')
@ApiBearerAuth()
export class AnsoffController {
    constructor(private ansoffService: AnsoffService) {}

    @Post('')
    @ApiOperation({ summary: 'Create a new Ansoff project' })
    @ApiResponse({
        status: 201,
        description: 'Project successfully created',
        type: Ansoff,
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(@Body() ansoffDto: AnsoffDto): Promise<Ansoff> {
        const ansoff = await this.ansoffService.create(ansoffDto)
        return ansoff
    }

    @Get('options')
    @ApiOperation({ summary: 'Get options for Ansoff analysis' })
    @ApiResponse({
        status: 200,
        description: 'Returns available options for Ansoff analysis',
    })
    getOptions() {
        return this.ansoffService.getOptions()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find an Ansoff project by ID' })
    @ApiParam({ name: 'id', description: 'ID of the Ansoff project' })
    @ApiResponse({
        status: 200,
        description: 'Returns the project details',
        type: Ansoff,
    })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async find(@Param('id') id: string) {
        return await this.ansoffService.findById(id)
    }

    @Post(':id/products')
    @ApiOperation({ summary: 'Add a product to an Ansoff project' })
    @ApiParam({ name: 'id', description: 'ID of the Ansoff project' })
    @ApiResponse({ status: 201, description: 'Product successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async addProduct(
        @Param('id') id: string,
        @Body() productRequest: AnsoffProductDto
    ) {
        return await this.ansoffService.addProduct(id, productRequest)
    }

    @Put(':id/products/:productId')
    @ApiOperation({ summary: 'Edit a product in an Ansoff project' })
    @ApiParam({ name: 'id', description: 'ID of the Ansoff project' })
    @ApiParam({ name: 'productId', description: 'ID of the product to edit' })
    @ApiResponse({ status: 200, description: 'Product successfully updated' })
    @ApiResponse({ status: 404, description: 'Product or project not found' })
    async editProduct(
        @Param('id') id: string,
        @Param('productId') productId: string,
        @Body() productRequest: AnsoffProductDto
    ) {
        return await this.ansoffService.editProduct(
            id,
            productId,
            productRequest
        )
    }

    @Delete(':projectId/products/:productId')
    @ApiOperation({ summary: 'Delete a product from an Ansoff project' })
    @ApiParam({ name: 'projectId', description: 'ID of the Ansoff project' })
    @ApiParam({ name: 'productId', description: 'ID of the product to delete' })
    @ApiResponse({ status: 200, description: 'Product successfully deleted' })
    @ApiResponse({ status: 404, description: 'Product or project not found' })
    async deleteProduct(
        @Param('projectId') projectId: string,
        @Param('productId') productId: string
    ) {
        return await this.ansoffService.deleteProduct(projectId, productId)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Ansoff project' })
    @ApiParam({ name: 'id', description: 'ID of the Ansoff project to delete' })
    @ApiResponse({ status: 200, description: 'Project successfully deleted' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.ansoffService.delete(id)
        return {
            _id: documentId,
        }
    }
}
