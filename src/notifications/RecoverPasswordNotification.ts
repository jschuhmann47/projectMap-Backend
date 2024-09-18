import { EmailNotification } from './EmailNotification'
import { User } from 'src/user/user.schema'

export class RecoverPasswordNotification extends EmailNotification {
    user: User

    constructor(user: User) {
        super()
        this.user = user
        this.bodyText = `Recupero de contraseña - ProjectMap 🧭`
        this.subject = `Tu código de recuperación es: ninguno`
    }

    async notifyUser() {
        return super.send(this.user.email)
    }
}
