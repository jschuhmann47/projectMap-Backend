import { Controller, Delete, Get, Param } from '@nestjs/common'
import { PdcaService } from './pdca.service'

@Controller('pdca')
export class PdcaController {
    constructor(private readonly pdcaService: PdcaService) {}

    @Get(':pdcaId')
    async findById(@Param('pdcaId') pdcaId: string) {
        const pdca = await this.pdcaService.findById(pdcaId)
        return pdca
    }

    @Delete(':pdcaId')
    async deletePdca(@Param('pdcaId') pdcaId: string) {
        return await this.pdcaService.deletePdca(pdcaId)
    }
}
