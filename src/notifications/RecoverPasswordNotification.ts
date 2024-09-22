import { EmailNotification } from './EmailNotification'
import { User } from 'src/user/user.schema'

export class RecoverPasswordNotification extends EmailNotification {
    user: User
    code: number

    constructor(user: User) {
        super()
        this.user = user
        this.bodyText = `Tu código de recuperación es: ` + this.code
        this.subject = `Recupero de contraseña - ProjectMap 🧭`
    }

    async notifyUser() {
        return super.send(this.user.email)
    }
}
