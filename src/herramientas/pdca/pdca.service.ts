import { Injectable } from '@nestjs/common'
import { Pdca } from './pdca.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class PdcaService {
    constructor(@InjectModel(Pdca.name) private pdcaModel: Model<Pdca>) {}

    async findById(id: string) {
        return this.pdcaModel.findById(id).exec()
    }
}
