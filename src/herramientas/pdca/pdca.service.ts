import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { Action, Pdca } from './pdca.schema'
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

    async editPdca(pdcaId: string, pdcaDto: PdcaDto) {
        const pdca = await this.pdcaModel.findById(pdcaId)
        if (!pdca) {
            throw new NotFoundException()
        }
        if (pdcaDto.name) {
            pdca.name = pdcaDto.name
        }
        if (pdcaDto.actions !== undefined) {
            pdca.actions = []
            pdcaDto.actions.forEach((a) => {
                if (!a.name) {
                    throw new BadRequestException('Missing action name')
                }
                if (a.progress) {
                    if (a.progress < 0 || a.progress > 100) {
                        throw new BadRequestException('Invalid progress value')
                    }
                }
                pdca.actions.push(
                    new Action(a.name, a.responsible, a.progress, a.deadline)
                )
            })
        }
        return pdca.save()
    }
}
