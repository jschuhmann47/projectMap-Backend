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
import { ApiTags } from '@nestjs/swagger'
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
    async create(@Body() balancedScorecardDto: BalancedScorecardDto) {
        return await this.balancedScorecardService.create(balancedScorecardDto)
    }

    @Get('options')
    getOptions() {
        return this.balancedScorecardService.getOptions()
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.balancedScorecardService.findById(id)
    }

    @Post(':id/objectives')
    async addObjective(
        @Param('id') id: string,
        @Body() objectiveDto: ObjectiveDto
    ) {
        return this.balancedScorecardService.addObjective(id, objectiveDto)
    }

    @Post(':id/objectives/:objectiveId/checkpoints')
    async addCheckpoint(
        @Param('id') id: string,
        @Param('objectiveId') objectiveId: string,
        @Body() checkpointDto: CheckpointDto
    ) {
        return this.balancedScorecardService.addCheckpoint(
            id,
            objectiveId,
            checkpointDto
        )
    }

    @Delete(':id/objectives/:objectiveId')
    async removeObjective(
        @Param('id') id: string,
        @Param('objectiveId') objectiveId: string
    ) {
        return this.balancedScorecardService.removeObjective(id, objectiveId)
    }

    @Delete(':id/objectives/:objectiveId/checkpoints/:checkpointId')
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

    @Put(':id')
    async editBalancedScorecard(
        @Param('id') id: string,
        @Body() balancedScoreCardDto: BalancedScorecardDto
    ) {
        return this.balancedScorecardService.edit(id, balancedScoreCardDto)
    }

    @Put(':id/objectives/:objectiveId')
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

    @Put(':id/objectives/:objectiveId/checkpoints/:checkpointId')
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

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const documentId = await this.balancedScorecardService.delete(id)
        return {
            _id: documentId,
        }
    }
}
