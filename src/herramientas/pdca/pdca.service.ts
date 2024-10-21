import { BadRequestException, Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
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
        if (!pdcaDto.name) {
            throw new BadRequestException('Name required')
        }

        if (!pdcaDto.projectId) {
            throw new BadRequestException('Project ID required')
        }
        const pdca = new this.pdcaModel(pdcaDto)
        pdca.progress = 0
        pdca.actions = []
        return pdca.save()
    }

    async deletePdca(id: string) {
        const result = await this.pdcaModel.deleteOne({ _id: id }).exec()
        if (result.deletedCount) {
            return {}
        } else {
            throw new NotFoundException()
        }
    }

    async findByProjectId(projectId: string) {
        return this.pdcaModel.find({ projectId: projectId }).exec()
    }
}
