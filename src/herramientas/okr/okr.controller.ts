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
import { AuthGuard } from '@nestjs/passport'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger'
import { KeyResultDto, OkrDto } from './okr.dto'
import { OkrService } from './okr.service'

@Controller('okr')
@ApiTags('okr')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth() // Requiere autenticación JWT
export class OkrController {
    constructor(private okrService: OkrService) {}

    @Post('')
    @ApiOperation({ summary: 'Create a new OKR' })
    @ApiResponse({ status: 201, description: 'OKR successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(@Body() okrDto: OkrDto) {
        const okr = await this.okrService.create(okrDto)
        return okr
    }

    @Get(':okrId')
    @ApiOperation({ summary: 'Find an OKR by ID' })
    @ApiParam({ name: 'okrId', description: 'ID of the OKR to retrieve' })
    @ApiResponse({ status: 200, description: 'Returns the OKR details' })
    @ApiResponse({ status: 404, description: 'OKR not found' })
    async findById(@Param('okrId') okrId: string) {
        const okr = await this.okrService.findById(okrId)
        return okr
    }

    @Get(':okrId/possible-parents')
    @ApiOperation({ summary: 'Retrieve possible parent OKRs' })
    @ApiParam({
        name: 'okrId',
        description: 'ID of the OKR to find possible parents for',
    })
    @ApiResponse({ status: 200, description: 'List of possible parent OKRs' })
    async getPossibleParents(@Param('okrId') okrId: string) {
        const okr = await this.okrService.getPossibleOkrsFromParent(
            okrId,
            false
        )
        return okr
    }

    @Post(':okrId/parent')
    @ApiOperation({ summary: 'Add a parent OKR' })
    @ApiParam({
        name: 'okrId',
        description: 'ID of the OKR to add a parent to',
    })
    @ApiResponse({ status: 201, description: 'Parent OKR successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async addParentOkr(
        @Param('okrId') okrId: string,
        @Body() parentDto: { parentOkrId: string }
    ) {
        const okr = await this.okrService.addParentOkr(
            okrId,
            parentDto.parentOkrId
        )
        return okr
    }

    @Put(':okrId')
    @ApiOperation({ summary: 'Edit an existing OKR' })
    @ApiParam({ name: 'okrId', description: 'ID of the OKR to edit' })
    @ApiResponse({ status: 200, description: 'OKR successfully updated' })
    @ApiResponse({ status: 404, description: 'OKR not found' })
    async editOkr(@Param('okrId') okrId: string, @Body() okrDto: OkrDto) {
        const okr = await this.okrService.editOkr(okrId, okrDto)
        return okr
    }

    @Delete(':okrId')
    @ApiOperation({ summary: 'Delete an OKR' })
    @ApiParam({ name: 'okrId', description: 'ID of the OKR to delete' })
    @ApiResponse({ status: 200, description: 'OKR successfully deleted' })
    @ApiResponse({ status: 404, description: 'OKR not found' })
    async removeOkr(@Param('okrId') okrId: string) {
        const okr = await this.okrService.delete(okrId)
        return okr
    }

    @Post(':okrId/key-result')
    @ApiOperation({ summary: 'Add a key result to an OKR' })
    @ApiParam({
        name: 'okrId',
        description: 'ID of the OKR to add a key result to',
    })
    @ApiResponse({ status: 201, description: 'Key result successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async addKeyResult(
        @Param('okrId') okrId: string,
        @Body() keyResultDto: KeyResultDto
    ) {
        const okr = await this.okrService.addKeyResult(okrId, keyResultDto)
        return okr
    }

    @Put(':okrId/key-result/:keyResultId')
    @ApiOperation({ summary: 'Edit a key result in an OKR' })
    @ApiParam({ name: 'okrId', description: 'ID of the OKR' })
    @ApiParam({
        name: 'keyResultId',
        description: 'ID of the key result to edit',
    })
    @ApiResponse({
        status: 200,
        description: 'Key result successfully updated',
    })
    @ApiResponse({ status: 404, description: 'OKR or key result not found' })
    async editKeyResult(
        @Param('okrId') okrId: string,
        @Param('keyResultId') keyResultId: string,
        @Body() keyResultDto: KeyResultDto
    ) {
        const okr = await this.okrService.editKeyResult(
            okrId,
            keyResultId,
            keyResultDto
        )
        return okr
    }

    @Delete(':okrId/key-result/:keyResultId')
    @ApiOperation({ summary: 'Delete a key result from an OKR' })
    @ApiParam({ name: 'okrId', description: 'ID of the OKR' })
    @ApiParam({
        name: 'keyResultId',
        description: 'ID of the key result to delete',
    })
    @ApiResponse({
        status: 200,
        description: 'Key result successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'OKR or key result not found' })
    async removeKeyResult(
        @Param('okrId') okrId: string,
        @Param('keyResultId') keyResultId: string
    ) {
        const okr = await this.okrService.removeKeyResult(okrId, keyResultId)
        return okr
    }
}
