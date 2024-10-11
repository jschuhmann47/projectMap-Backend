import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
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

dotenv.config()
if (
    !process.env.MONGO_URI ||
    !process.env.SECRET_KEY ||
    !process.env.PROJECTMAP_WEBPAGE ||
    !process.env.NODEMAILER_GOOGLE_APP_USER ||
    !process.env.NODEMAILER_GOOGLE_APP_PASSWORD
) {
    throw new Error('missing env vars')
}

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
        QuestionnaireModule,
        ContinuousImprovementModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProjectStageUserEditionMiddleware).forRoutes(
            {
                path: 'foda',
                method: RequestMethod.POST,
            },
            {
                path: 'porter',
                method: RequestMethod.POST,
            },
            {
                path: 'pestel',
                method: RequestMethod.POST,
            },
            {
                path: 'ansoff',
                method: RequestMethod.POST,
            },
            {
                path: 'mckinsey',
                method: RequestMethod.POST,
            },
            {
                path: 'questionnaires',
                method: RequestMethod.POST,
            },
            {
                path: 'balanced-scorecards',
                method: RequestMethod.POST,
            },
            {
                path: 'okr-projects',
                method: RequestMethod.POST,
            }
        )
    }
}
