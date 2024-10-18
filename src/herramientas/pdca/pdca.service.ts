import { BadRequestException, Injectable } from '@nestjs/common'
import { Pdca } from './pdca.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PdcaDto } from './pdca.dto'

@Injectable()
export class PdcaService {
    constructor(@InjectModel(Pdca.name) private pdcaModel: Model<Pdca>) {}

    async findById(id: string) {
        return this.pdcaModel.findById(id).exec()
    }

    async createPdca(pdcaDto: PdcaDto) {
        if (!pdcaDto.name || !pdcaDto.projectId) {
            throw new BadRequestException('Missing fields')
        }
        const pdca = new this.pdcaModel(pdcaDto)
        pdca.progress = 0
        pdca.actions = []
        return pdca.save()
    }
}