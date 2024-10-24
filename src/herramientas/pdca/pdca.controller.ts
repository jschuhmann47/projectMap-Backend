import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common'
import { PdcaService } from './pdca.service'
import { PdcaDto } from './pdca.dto'

@Controller('pdca')
export class PdcaController {
    constructor(private readonly pdcaService: PdcaService) {}

    @Get(':pdcaId')
    async findById(@Param('pdcaId') pdcaId: string) {
        const pdca = await this.pdcaService.findById(pdcaId)
        return pdca
    }

    @Post('')
    async createPdca(@Body() pdcaDto: PdcaDto) {
        const pdca = await this.pdcaService.createPdca(pdcaDto)
        return pdca
    }

    @Patch(':pdcaId')
    async editPdca(@Param('pdcaId') pdcaId: string, @Body() pdcaDto: PdcaDto) {
        const pdca = await this.pdcaService.editPdca(pdcaId, pdcaDto)
        return pdca
    }

    @Delete(':pdcaId')
    async deletePdca(@Param('pdcaId') pdcaId: string) {
        return await this.pdcaService.deletePdca(pdcaId)
    }
}
