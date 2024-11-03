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
import { OkrModule } from './herramientas/okr/okr.module'
import { PdcaModule } from './herramientas/pdca/pdca.module'
import { ToolPermissionsMiddleware } from './middleware/toolPermissions.middleware'
import { ProjectPermissionsMiddleware } from './middleware/projectPermissions.middleware'

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
        OkrModule,
        QuestionnaireModule,
        OkrModule,
        PdcaModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ToolPermissionsMiddleware)
            .exclude(
                'questionnaires/questions',
                'pestel/options',
                'ansoff/options',
                'balanced-scorecards/options',
                'foda/options',
                'foda/preSeeds',
                'porter/options',
                'porter/preguntas'
            )
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
        consumer.apply(ProjectPermissionsMiddleware).forRoutes('projects/')
    }
}
