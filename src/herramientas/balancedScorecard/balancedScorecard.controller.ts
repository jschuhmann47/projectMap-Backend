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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import {
    BalancedScorecardDto,
    CheckpointDto,
    ObjectiveDto,
} from './balancedScorecard.dto'
import { BalancedScorecardService } from './balancedScorecard.service'

@Controller('balanced-scorecards')
@ApiTags('balanced-scorecards')
@UseGuards(AuthGuard('jwt'))
export class BalancedScorecardController {
    constructor(private balancedScorecardService: BalancedScorecardService) {}

    @Post('')
    @ApiOperation({ summary: 'Create a new Balanced Scorecard' })
    @ApiResponse({
        status: 201,
        description: 'Balanced Scorecard successfully created',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async create(@Body() balancedScorecardDto: BalancedScorecardDto) {
        return await this.balancedScorecardService.create(balancedScorecardDto)
    }

    @Get('options')
    @ApiOperation({ summary: 'Get options for Balanced Scorecard analysis' })
    @ApiResponse({
        status: 200,
        description: 'Returns available options for Balanced Scorecard',
    })
    getOptions() {
        return this.balancedScorecardService.getOptions()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a Balanced Scorecard by ID' })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiResponse({
        status: 200,
        description: 'Returns the Balanced Scorecard details',
    })
    @ApiResponse({ status: 404, description: 'Balanced Scorecard not found' })
    async findById(@Param('id') id: string) {
        return this.balancedScorecardService.findById(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Edit a Balanced Scorecard' })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiResponse({
        status: 200,
        description: 'Balanced Scorecard successfully updated',
    })
    @ApiResponse({ status: 404, description: 'Balanced Scorecard not found' })
    async editBalancedScorecard(
        @Param('id') id: string,
        @Body() balancedScoreCardDto: BalancedScorecardDto
    ) {
        return this.balancedScorecardService.edit(id, balancedScoreCardDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Balanced Scorecard' })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiResponse({
        status: 200,
        description: 'Balanced Scorecard successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'Balanced Scorecard not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.balancedScorecardService.delete(id)
        return {
            _id: documentId,
        }
    }

    @Post(':id/objectives')
    @ApiOperation({ summary: 'Add an objective to a Balanced Scorecard' })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiResponse({ status: 201, description: 'Objective successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async addObjective(
        @Param('id') id: string,
        @Body() objectiveDto: ObjectiveDto
    ) {
        return this.balancedScorecardService.addObjective(id, objectiveDto)
    }

    @Put(':id/objectives/:objectiveId')
    @ApiOperation({ summary: 'Edit an objective in a Balanced Scorecard' })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiParam({
        name: 'objectiveId',
        description: 'ID of the objective to edit',
    })
    @ApiResponse({ status: 200, description: 'Objective successfully updated' })
    @ApiResponse({
        status: 404,
        description: 'Objective or Balanced Scorecard not found',
    })
    async editObjective(
        @Param('id') id: string,
        @Param('objectiveId') objectiveId: string,
        @Body() objectiveDto: ObjectiveDto
    ) {
        return this.balancedScorecardService.editObjective(
            id,
            objectiveId,
            objectiveDto
        )
    }

    @Delete(':id/objectives/:objectiveId')
    @ApiOperation({ summary: 'Delete an objective from a Balanced Scorecard' })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiParam({
        name: 'objectiveId',
        description: 'ID of the objective to delete',
    })
    @ApiResponse({ status: 200, description: 'Objective successfully deleted' })
    @ApiResponse({
        status: 404,
        description: 'Objective or Balanced Scorecard not found',
    })
    async removeObjective(
        @Param('id') id: string,
        @Param('objectiveId') objectiveId: string
    ) {
        return this.balancedScorecardService.removeObjective(id, objectiveId)
    }

    @Delete(':id/objectives/:objectiveId/checkpoints/:checkpointId')
    @ApiOperation({
        summary:
            'Delete a checkpoint from an objective in a Balanced Scorecard',
    })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiParam({ name: 'objectiveId', description: 'ID of the objective' })
    @ApiParam({
        name: 'checkpointId',
        description: 'ID of the checkpoint to delete',
    })
    @ApiResponse({
        status: 200,
        description: 'Checkpoint successfully deleted',
    })
    @ApiResponse({
        status: 404,
        description: 'Checkpoint, Objective, or Balanced Scorecard not found',
    })
    async removeCheckpoint(
        @Param('id') id: string,
        @Param('objectiveId') objectiveId: string,
        @Param('checkpointId') checkpointId: string
    ) {
        return this.balancedScorecardService.removeCheckpoint(
            id,
            objectiveId,
            checkpointId
        )
    }

    @Put(':id/objectives/:objectiveId/checkpoints/:checkpointId')
    @ApiOperation({
        summary: 'Edit a checkpoint in an objective of a Balanced Scorecard',
    })
    @ApiParam({ name: 'id', description: 'ID of the Balanced Scorecard' })
    @ApiParam({ name: 'objectiveId', description: 'ID of the objective' })
    @ApiParam({
        name: 'checkpointId',
        description: 'ID of the checkpoint to edit',
    })
    @ApiResponse({
        status: 200,
        description: 'Checkpoint successfully updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Checkpoint, Objective, or Balanced Scorecard not found',
    })
    async editCheckpoint(
        @Param('id') id: string,
        @Param('objectiveId') objectiveId: string,
        @Param('checkpointId') checkpointId: string,
        @Body() checkpointDto: CheckpointDto
    ) {
        return this.balancedScorecardService.editCheckpoint(
            id,
            objectiveId,
            checkpointId,
            checkpointDto
        )
    }
}
