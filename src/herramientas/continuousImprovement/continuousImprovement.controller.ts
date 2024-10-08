import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { AnsoffService } from '../ansoff/ansoff.service'
import { BalancedScorecardService } from '../balancedScorecard/balancedScorecard.service'
import { FodaService } from '../foda/foda.service'
import { MckinseyService } from '../mckinsey/mckinsey.service'
import { OkrService } from '../okr/okr.service'
import { PestelService } from '../pestel/pestel.service'
import { PorterService } from '../porter/porter.service'
import { QuestionnaireService } from '../questionnaire/questionnaire.service'

@UseGuards(AuthGuard('jwt'))
@ApiTags('continuous-improvements')
@Controller('continuous-improvements')
export class ContinuousImprovementController {
    constructor(
        private fodaService: FodaService,
        private pestelService: PestelService,
        private ansoffService: AnsoffService,
        private porterService: PorterService,
        private mckinseyService: MckinseyService,
        private okrService: OkrService,
        private balancedService: BalancedScorecardService,
        private questionnaireService: QuestionnaireService
    ) {}

    @Get(':projectId')
    async getContinuousImprovement(@Param('projectId') projectId: string) {
        const fodas = await this.fodaService.getAllByProjectId(projectId)
        const pestels = await this.pestelService.getAllByProjectId(projectId)
        const ansoffs = await this.ansoffService.getAllByProjectId(projectId)
        const porters = await this.porterService.getAllByProjectId(projectId)
        const porters_consejos = porters.map((porter) => ({
            titulo: porter.titulo,
            _id: porter._id,
            consejos: this.porterService.calcularConsejos(porter.preguntas),
        }))
        const mckinseys =
            await this.mckinseyService.getAllByProjectId(projectId)
        const okrs = await this.okrService.getAllByProjectId(projectId)
        const balancedScorecards =
            await this.balancedService.getAllByProjectId(projectId)
        return {
            fodas: fodas.slice(0, 2),
            pestels: pestels.slice(0, 1),
            ansoffs: ansoffs.slice(0, 2),
            porters: porters_consejos.slice(0, 2),
            mckinseys: mckinseys.slice(0, 1),
            okrs: okrs.slice(0, 1),
            balancedScorecards: balancedScorecards.slice(0, 1),
        }
    }
}
