import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Area, Importancia, Intensidad, Tendencia, Urgencia } from './enums'
import { FactorDto, FodaDto } from './foda.dto'
import { Factor, FodaDocument } from './foda.schema'
import { Preseeds } from './foda.preseeds'

@Injectable()
export class FodaService {
    constructor(@InjectModel('FODA') private fodaModel: Model<FodaDocument>) {}

    async getPreSeeds() {
        const preSeeds = Preseeds.getPreseeds
        const preSeedsFormated = new Map<
            Area,
            Array<{ descripcion: string; consejo: string }>
        >()

        preSeeds.forEach((preSeed) => {
            const { area, descripcion, consejo } = preSeed
            const list = preSeedsFormated.get(area)
            if (!list) preSeedsFormated.set(area, [])
            preSeedsFormated.set(area, [
                ...preSeedsFormated.get(area)!,
                { descripcion, consejo },
            ])
        })

        return preSeedsFormated
    }

    async getOptions() {
        return {
            importancia: Object.values(Importancia),
            intensidad: Object.values(Intensidad),
            tendencia: Object.values(Tendencia),
            urgencia: Object.values(Urgencia),
        }
    }

    async getAllByProjectId(projectId: string) {
        return this.fodaModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async getOne(id: string) {
        return this.fodaModel.findById(id)
    }

    async insertFactor(id: string, factorDto: FactorDto) {
        const foda = await this.fodaModel.findById(id)
        if (!foda) {
            throw new NotFoundException()
        }
        const factor = new Factor(
            factorDto.descripcion,
            factorDto.area as Area,
            factorDto.importancia as Importancia,
            factorDto.intensidad as Intensidad,
            factorDto.tendencia as Tendencia,
            factorDto.urgencia as Urgencia
        )
        foda.factores.push(factor)
        await new this.fodaModel(foda).save()
        return this.getOne(id)
    }

    async create(newFoda: FodaDto) {
        const foda = new this.fodaModel(newFoda)
        const fodaCreadted = await foda.save()
        return fodaCreadted
    }

    async update(id: string, updated: FodaDto) {
        const foda = await this.fodaModel.findById(id)
        if (!foda) {
            throw new NotFoundException()
        }
        foda.titulo = updated.titulo

        return new this.fodaModel(foda).save()
    }

    async delete(id: string) {
        const result = await this.fodaModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Foda not found', HttpStatus.NOT_FOUND)
    }

    async deleteAllWithProjectId(projectId: string) {
        const result = await this.fodaModel.deleteMany({ projectId })

        if (result && result.acknowledged) {
            return projectId
        } else {
            throw new HttpException(
                'Foda delete error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteFactor(id: string, idFactor: string) {
        const foda = await this.fodaModel.findById(id)
        if (!foda) {
            throw new NotFoundException()
        }
        const fodaObject = foda.toObject()
        const factores = fodaObject.factores.filter(
            (factor) => factor._id.toString() != idFactor
        )

        foda.factores = factores
        await new this.fodaModel(foda).save()
        return this.getOne(id)
    }

    async updateFactor(id: string, idFactor: string, updatedFactor: FactorDto) {
        const foda = await this.fodaModel.findById(id).then((foda) => {
            if (!foda) {
                throw new NotFoundException()
            }
            const factor = foda.factores.find(
                (factor) => factor._id.toString() == idFactor
            )
            if (!factor) {
                throw new NotFoundException()
            }
            if (updatedFactor.area) factor.area = updatedFactor.area as Area
            if (updatedFactor.importancia)
                factor.importancia = updatedFactor.importancia as Importancia
            if (updatedFactor.intensidad)
                factor.intensidad = updatedFactor.intensidad as Intensidad
            if (updatedFactor.tendencia)
                factor.tendencia = updatedFactor.tendencia as Tendencia
            if (updatedFactor.urgencia)
                factor.urgencia = updatedFactor.urgencia as Urgencia
            if (updatedFactor.descripcion)
                factor.descripcion = updatedFactor.descripcion
            return foda.save()
        })
        return foda
    }
}
