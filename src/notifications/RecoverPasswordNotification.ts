import { EmailNotification } from './EmailNotification'

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: #f7f7f7;
            border-radius: 5px;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            padding: 20px;
            border: 1px solid #ddd;
            margin: 20px 0;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ProjectMap 🧭</h1>
        <h2>Código de verificación</h2>
        <p>Hola! Este es tu código para recuperar la contraseña:</p>
        <div class="code">CODE</div>
        <p>Por favor ingresá <a href="PROJECTMAP_WEBPAGE">aquí</a> para completar el proceso</p>
    </div>
</body>
</html>
`

export class RecoverPasswordNotification extends EmailNotification {
    email: string

    constructor(email: string, code: number) {
        super()
        this.email = email
        this.bodyText = htmlTemplate
            .replace('CODE', code.toString())
            .replace('PROJECTMAP_WEBPAGE', process.env.PROJECTMAP_WEBPAGE!)
        this.subject = `Recupero de contraseña - ProjectMap 🧭`
    }

    async notifyUser() {
        return super.send(this.email)
    }
}
