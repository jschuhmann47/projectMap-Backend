import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Ansoff, AnsoffDocument, Producto } from './ansoff.schema'
import { Model } from 'mongoose'
import * as Estrategia from './estrategia'
import { AnsoffDto, AnsoffProductDto } from './ansoff.dto'
import { SituacionDelMercado } from './situacionDelMercado'
import { Exito } from './exito'
import { SituacionDelProducto } from './situacionDelProducto'

@Injectable()
export class AnsoffService {
    constructor(
        @InjectModel(Ansoff.name) private ansoffModel: Model<AnsoffDocument>
    ) {}

    async create(ansoffDto: AnsoffDto) {
        const ansoff = new this.ansoffModel(ansoffDto)
        ansoff.productos.forEach((product) => {
            product.estrategia = Estrategia.calcularEstrategia(product)
        })
        return ansoff.save()
    }

    async addProduct(id: string, productRequest: AnsoffProductDto) {
        const ansoff = await this.ansoffModel.findOne({ _id: id }).exec()
        if (!ansoff) {
            throw new NotFoundException()
        }
        ansoff.productos.push(
            new Producto(
                productRequest.nombre,
                productRequest.situacionDelMercado,
                productRequest.situacionDelProducto,
                productRequest.exito
            )
        )
        return await new this.ansoffModel(ansoff).save()
    }

    async editProduct(
        id: string,
        productId: string,
        productRequest: AnsoffProductDto
    ) {
        const ansoff = await this.ansoffModel.findOne({ _id: id }).exec()
        if (!ansoff) {
            throw new NotFoundException()
        }
        ansoff.productos = ansoff.productos.map((product) => {
            if (product._id.toString() == productId) {
                product.nombre = productRequest.nombre
                product.situacionDelProducto =
                    productRequest.situacionDelProducto.toString()
                product.situacionDelMercado =
                    productRequest.situacionDelMercado.toString()
                product.exito = productRequest.exito
                product.estrategia = Estrategia.calcularEstrategia(product)
                return product
            }
            return product
        })
        return new this.ansoffModel(ansoff).save()
    }

    async deleteProduct(id: string, productId: string) {
        const ansoff = await this.ansoffModel.findOne({ _id: id }).exec()
        if (!ansoff) {
            throw new NotFoundException()
        }
        ansoff.productos = ansoff.productos.filter(
            (product) => product._id.toString() != productId
        )
        return new this.ansoffModel(ansoff).save()
    }

    async findById(id: string) {
        return this.ansoffModel
            .findOne({
                _id: id,
            })
            .exec()
    }

    async getAllByProjectId(projectId: string) {
        return this.ansoffModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    getOptions() {
        return {
            situacionDelMercado: Object.values(SituacionDelMercado),
            situacionDelProducto: Object.values(SituacionDelProducto),
            exito: Object.values(Exito),
        }
    }

    async delete(id: string) {
        const result = await this.ansoffModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Ansoff not found', HttpStatus.NOT_FOUND)
    }

    async deleteAllWithProjectId(projectId: string) {
        const result = await this.ansoffModel.deleteMany({ projectId })

        if (result && result.acknowledged) {
            return projectId
        } else {
            throw new HttpException(
                'Ansoff delete error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
