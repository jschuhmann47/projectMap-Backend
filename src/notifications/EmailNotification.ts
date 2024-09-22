import * as nodemailer from 'nodemailer'

export abstract class EmailNotification {
    bodyText: string
    subject: string

    async send(destination: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'projectmaputnba@gmail.com',
                pass: process.env.NODEMAILER_GOOGLE_APP_PASSWORD,
            },
        })
        transporter.sendMail(
            {
                to: destination,
                subject: this.subject,
                html: '<p>' + this.bodyText + '</p>',
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (err, _) => {
                if (err) {
                    console.log('Error sending email: ', err)
                }
            }
        )
    }
}
