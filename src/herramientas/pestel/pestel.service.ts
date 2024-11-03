import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FactorDto, PestelDto } from './pestel.dto'
import { Area, Importancia, Intensidad, Tendencia } from './enums'
import { Factor, Pestel } from './pestel.schema'

@Injectable()
export class PestelService {
    constructor(@InjectModel(Pestel.name) private pestelModel: Model<Pestel>) {}

    async getAll() {
        return this.pestelModel.find()
    }

    async getAllByProjectId(projectId: string) {
        return this.pestelModel
            .find({ projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async getOne(id: string) {
        return this.pestelModel.findById(id)
    }

    async insertFactor(id: string, factorDto: FactorDto) {
        const pestel = await this.pestelModel.findById(id)
        if (!pestel) {
            throw new NotFoundException()
        }
        const factor = new Factor(
            factorDto.descripcion,
            factorDto.area,
            factorDto.importancia,
            factorDto.intensidad,
            factorDto.tendencia
        )
        pestel.factores.push(factor)

        await new this.pestelModel(pestel).save()
        return this.pestelModel.findById(id)
    }

    async editFactor(id: string, idFactor: string, updatedFactor: FactorDto) {
        const pestel = await this.pestelModel.findById(id).then((pestel) => {
            if (!pestel) {
                throw new NotFoundException()
            }
            const factor = pestel.factores.find(
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
            if (updatedFactor.descripcion)
                factor.descripcion = updatedFactor.descripcion
            return pestel.save()
        })
        return pestel
    }

    async create(newPestel: PestelDto) {
        const pestel = new this.pestelModel(newPestel)
        const pestelCreadted = await pestel.save()
        return pestelCreadted
    }

    async update(id: string, updated: PestelDto) {
        await this.pestelModel.findOneAndUpdate({ _id: id }, updated)
        return this.pestelModel.findById(id)
    }

    async delete(id: string) {
        const result = await this.pestelModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Pestel not found', HttpStatus.NOT_FOUND)
    }

    async deleteAllWithProjectId(projectId: string) {
        const result = await this.pestelModel.deleteMany({ projectId })

        if (result && result.acknowledged) {
            return projectId
        } else {
            throw new HttpException(
                'Pestel delete error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async deleteFactor(id: string, idFactor: string) {
        const pestel = await this.pestelModel.findById(id).exec()
        if (!pestel) {
            throw new NotFoundException()
        }
        const factores = pestel.factores.filter(
            (factor) => factor._id.toString() != idFactor
        )
        await this.pestelModel.findOneAndUpdate({ _id: id }, { factores })
        return this.pestelModel.findById(id)
    }

    async getOptions() {
        return {
            area: Object.values(Area),
            importancia: Object.values(Importancia),
            intensidad: Object.values(Intensidad),
            tendencia: Object.values(Tendencia),
        }
    }
}
