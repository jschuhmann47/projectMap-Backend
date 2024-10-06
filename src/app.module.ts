import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'

import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import * as dotenv from 'dotenv'
import { FodaModule } from './herramientas/foda/foda.module'
import { PestelModule } from './herramientas/pestel/pestel.module'
import { AnsoffModule } from './herramientas/ansoff/ansoff.module'
import { ProjectModule } from './project/project.module'
import { PorterModule } from './herramientas/porter/porter.module'
import { MckinseyModule } from './herramientas/mckinsey/mckinsey.module'
import { BalancedScorecardModule } from './herramientas/balancedScorecard/balanceScorecard.module'
import { QuestionnaireModule } from './herramientas/questionnaire/questionnaire.module'
import { ContinuousImprovementModule } from './herramientas/continuousImprovement/continuousImprovement.module'
import { ProjectStageUserEditionMiddleware } from './middleware/project.middleware'
import { OkrModule } from './herramientas/okr/okr.module'

dotenv.config()

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI),
        ProjectModule,
        UserModule,
        AuthModule,
        FodaModule,
        PestelModule,
        AnsoffModule,
        PorterModule,
        MckinseyModule,
        BalancedScorecardModule,
        OkrModule,
        QuestionnaireModule,
        ContinuousImprovementModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ProjectStageUserEditionMiddleware)
            .forRoutes(
                'foda',
                'porter',
                'pestel',
                'ansoff',
                'mckinsey',
                'questionnaires',
                'balanced-scorecards',
                'okr'
            )
    }
}
