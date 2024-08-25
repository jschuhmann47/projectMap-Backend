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
import { ApiTags } from '@nestjs/swagger'
import { OkrService } from './okr.service'
import { KeyResultDto, KeyStatusDto, OkrDto } from './okr.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('okr')
@ApiTags('okr')
@UseGuards(AuthGuard('jwt'))
export class OkrController {
    constructor(private okrService: OkrService) {}
    @Post('')
    async insert(@Body() okrDto: OkrDto) {
        const okr = await this.okrService.create(okrDto)
        return okr
    }

    @Get(':okrId')
    async findById(@Param('okrId') okrId: string) {
        const okr = await this.okrService.findById(okrId)
        return okr
    }

    @Put(':okrId')
    async editOkr(@Param('okrId') okrId: string, @Body() okrDto: OkrDto) {
        const okr = await this.okrService.editOkr(okrId, okrDto)
        return okr
    }

    @Delete(':okrId')
    async removeOkr(@Param('okrId') okrId: string) {
        const okr = await this.okrService.delete(okrId)
        return okr
    }

    @Post(':okrId/key-result')
    async addKeyResult(
        @Param('okrId') okrId: string,
        @Body() keyResultDto: KeyResultDto
    ) {
        const okr = await this.okrService.addKeyResult(okrId, keyResultDto)
        return okr
    }

    @Put(':okrId/key-result/:keyResultId')
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
    async removeKeyResult(
        @Param('okrId') okrId: string,
        @Param('keyResultId') keyResultId: string
    ) {
        const okr = await this.okrService.removeKeyResult(okrId, keyResultId)
        return okr
    }

    @Put(':okrId/key-results/:keyResultId/key-status/:keyStatusId')
    async editKeyStatus(
        @Param('okrId') okrId: string,
        @Param('keyResultId') keyResultId: string,
        @Param('keyStatusId') keyStatusId: string,
        @Body() keyStatusDto: KeyStatusDto
    ) {
        const okr = await this.okrService.editKeyStatus(
            okrId,
            keyResultId,
            keyStatusId,
            keyStatusDto
        )
        return okr
    }
}
