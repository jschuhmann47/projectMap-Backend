import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
    PorterDto,
    PreguntaDto,
    BulkEditQuestions,
    BulkQuestionItem,
} from './porter.dto'
import { Porter, PorterDocument, Pregunta } from './porter.schema'
import { Fuerza } from './fuerza'
import { NivelDeConcordancia } from './nivelDeConcordancia'
import { Valoracion } from './valoracion'
import { Preguntas } from './preguntas'
import { Consejos } from './consejos'

@Injectable()
export class PorterService {
    constructor(
        @InjectModel(Porter.name) private porterModel: Model<PorterDocument>
    ) {}

    async create(porterDto: PorterDto) {
        const porter = new this.porterModel(porterDto)
        return porter.save()
    }

    async getOptions() {
        return {
            ['fuerza']: Object.values(Fuerza),
            ['nivelDeConcordancia']: Object.values(NivelDeConcordancia),
            ['valoracion']: Object.values(Valoracion),
        }
    }

    async getById(porterId: string) {
        const porter = await this.porterModel
            .findOne({
                _id: porterId,
            })
            .exec()
        if (!porter) {
            throw new NotFoundException()
        }

        if (porter.preguntas.length > 0)
            porter.preguntasFormatted = this.formatPreguntas(porter.preguntas)

        return porter
    }

    async editQuestion(
        porterId: string,
        questionId: string,
        preguntaDto: PreguntaDto
    ) {
        const porter = await this.porterModel.findOne({ _id: porterId }).exec()
        if (!porter) {
            throw new NotFoundException()
        }
        porter.preguntas = porter.preguntas.map((pregunta) => {
            if (pregunta._id.toString() == questionId) {
                pregunta.valoracion = preguntaDto.valoracion.toString()
                pregunta.nivelDeConcordancia = preguntaDto.nivelDeConcordancia
                return pregunta
            }
            return pregunta
        })
        return new this.porterModel(porter).save()
    }

    async deleteQuestion(porterId: string, questionId: string) {
        const porter = await this.porterModel.findOne({ _id: porterId }).exec()
        if (!porter) {
            throw new NotFoundException()
        }
        porter.preguntas = porter.preguntas.filter((pregunta) => {
            return pregunta._id.toString() != questionId
        })
        return new this.porterModel(porter).save()
    }

    async addQuestion(porterId: string, preguntaDto: PreguntaDto) {
        const porter = await this.porterModel.findOne({ _id: porterId }).exec()
        if (!porter) {
            throw new NotFoundException()
        }
        const question = new Pregunta(
            preguntaDto.preguntaId,
            preguntaDto.fuerza,
            preguntaDto.nivelDeConcordancia,
            preguntaDto.valoracion
        )
        porter.preguntas.push(question)
        return new this.porterModel(porter).save()
    }

    async replaceQuestions(
        porterId: string,
        questionsByFuerza: BulkEditQuestions
    ) {
        const newQuestions: Array<Pregunta> = []

        Object.entries(questionsByFuerza.preguntas).forEach(
            ([fuerza, questions]) => {
                Object.entries(questions).forEach(
                    ([questionId, questionObject]) => {
                        const question = questionObject as BulkQuestionItem
                        const preguntaDto = new Pregunta(
                            parseInt(questionId),
                            fuerza as Fuerza,
                            question.nivelDeConcordancia as NivelDeConcordancia,
                            question.valoracion as Valoracion
                        )

                        newQuestions.push(preguntaDto)
                    }
                )
            }
        )

        const porter = await this.porterModel.findById(porterId).exec()
        if (!porter) {
            throw new NotFoundException()
        }
        porter.preguntas = newQuestions
        return new this.porterModel(porter).save()
    }
    async getAllByProjectId(projectId: string) {
        return this.porterModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async delete(id: string) {
        const result = await this.porterModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Porter not found', HttpStatus.NOT_FOUND)
    }

    async deleteAllWithProjectId(projectId: string) {
        const result = await this.porterModel.deleteMany({ projectId })

        if (result && result.acknowledged) {
            return projectId
        } else {
            throw new HttpException(
                'Porter delete error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    getPreguntas() {
        return {
            [Fuerza.RIVALIDAD_ENTRE_COMPETIDORES]:
                Preguntas.rivalidadEntreCompetidores,
            [Fuerza.PODER_DE_NEGOCIACION_CON_LOS_CLIENTES]:
                Preguntas.poderDeNegociacionConElCliente,
            [Fuerza.PODER_DE_NEGOCIACION_CON_LOS_PROVEEDORES]:
                Preguntas.poderDeNegociacionConProveedores,
            [Fuerza.AMENAZA_DE_NUEVOS_COMPETIDORES]:
                Preguntas.amenazaDeNuevosCompetidores,
            [Fuerza.AMENAZA_DE_PRODUCTOS_SUBSTITUTOS]:
                Preguntas.amenazaDeSustitucion,
        }
    }

    calcularConsejos(preguntas: Pregunta[]) {
        return Object.values(Fuerza).map((fuerza) => {
            return this.calcularConsejosSegunFuerza(preguntas, fuerza)
        })
    }

    private calcularConsejosSegunFuerza(preguntas: Pregunta[], fuerza: Fuerza) {
        const preguntasConPuntaje: Map<number, number> = new Map()
        preguntas
            .filter((p) => p.fuerza == fuerza)
            .map(function (pregunta) {
                const puntaje = Preguntas.calcularPuntaje(
                    pregunta.nivelDeConcordancia as NivelDeConcordancia,
                    pregunta.valoracion as Valoracion
                )
                preguntasConPuntaje.set(pregunta.preguntaId, puntaje)
            })

        const consejos = []
        const consejosDeFuerza = Consejos.getConsejos(fuerza)
        for (const [id, consejo] of Object.entries(consejosDeFuerza)) {
            const puntaje = preguntasConPuntaje.get(consejo.pregunta)!
            const factor = puntaje + Number(id) / 10000
            if (puntaje)
                consejos.push({ consejo: consejo.consejo, factor: factor })
        }

        let puntajeTotal = 0
        preguntasConPuntaje.forEach(
            (value) => (puntajeTotal = puntajeTotal + value)
        )
        const consejoGeneral = this.calcularConsejoGeneral(puntajeTotal)

        return {
            fuerza: fuerza,
            consejoGeneral: consejoGeneral,
            valorConsejoGeneral: puntajeTotal,
            consejos: consejos
                .sort((a, b) => -(a.factor - b.factor))
                .splice(0, 5)
                .map((consejo) => consejo.consejo),
        }
    }

    private calcularConsejoGeneral(puntajeTotal: number) {
        if (puntajeTotal > 40)
            return 'Este índice es muy alto, lo que quiere decir que su estrategia debe siempre tener en cuenta esta fuerza a la hora de planear un cambio o transformación. Siga los consejos priorizados de acuerdo a su situación.'
        else if (puntajeTotal > 30)
            return 'Este índice es medio, lo que quiere decir que ese no es un punto prioritario en su estrategia, pero merece atención constante. Siga los principales consejos propuestos.'
        else
            return 'La fuerza de este índice es baja, lo que significa que éste no es un elemento prioritario en su estrategia en este momento. Revise los consejos a continuación para aumentarlo.'
    }

    private formatPreguntas(preguntas: Pregunta[]) {
        const preguntasFormatted: {
            [fuerza: string]: {
                [preguntaId: string]: {
                    nivelDeConcordancia: string
                    valoracion: string
                }
            }
        } = {}
        const fuerzas: Array<string> = []
        preguntas.forEach((pregunta) => {
            if (!fuerzas.includes(pregunta.fuerza)) {
                fuerzas.push(pregunta.fuerza)
            }
        })

        fuerzas.forEach((fuerza) => {
            preguntasFormatted[fuerza] = {}
            preguntas.forEach((pregunta) => {
                if (pregunta.fuerza === fuerza) {
                    preguntasFormatted[fuerza][pregunta.preguntaId] = {
                        nivelDeConcordancia: pregunta.nivelDeConcordancia,
                        valoracion: pregunta.valoracion,
                    }
                }
            })
        })
        return preguntasFormatted
    }
}
