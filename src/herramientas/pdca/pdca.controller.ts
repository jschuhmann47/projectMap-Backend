import { Controller, Get, Param } from '@nestjs/common'
import { PdcaService } from './pdca.service'

@Controller('pdca')
export class PdcaController {
    constructor(private readonly pdcaService: PdcaService) {}

    @Get(':pdcaId')
    async findById(@Param('pdcaId') pdcaId: string) {
        const pdca = await this.pdcaService.findById(pdcaId)
        return pdca
    }
}
