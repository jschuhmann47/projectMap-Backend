import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FodaModule } from '../herramientas/foda/foda.module'
import { PestelModule } from '../herramientas/pestel/pestel.module'
import { AnsoffModule } from '../herramientas/ansoff/ansoff.module'
import { BalancedScorecardModule } from '../herramientas/balancedScorecard/balanceScorecard.module'
import { MckinseyModule } from '../herramientas/mckinsey/mckinsey.module'
import { OkrModule } from '../herramientas/okr/okr.module'
import { PorterModule } from '../herramientas/porter/porter.module'
import { QuestionnaireModule } from '../herramientas/questionnaire/questionnaire.module'
import { UserModule } from '../user/user.module'
import { ProjectController } from './project.controller'
import { Project, ProjectSchema } from './project.schema'
import { ProjectService } from './project.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Project.name, schema: ProjectSchema },
        ]),
        FodaModule,
        PestelModule,
        AnsoffModule,
        PorterModule,
        MckinseyModule,
        forwardRef(() => OkrModule),
        BalancedScorecardModule,
        QuestionnaireModule,
        UserModule,
    ],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [ProjectService],
})
export class ProjectModule {}
