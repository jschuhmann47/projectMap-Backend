import { EmailNotification } from './EmailNotification'

export class RecoverPasswordNotification extends EmailNotification {
    email: string

    constructor(email: string, code: number) {
        super()
        this.email = email
        this.bodyText = `Tu código de recuperación es: ` + code
        this.subject = `Recupero de contraseña - ProjectMap 🧭`
    }

    async notifyUser() {
        return super.send(this.email)
    }
}
