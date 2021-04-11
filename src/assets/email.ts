import nodemailer from 'nodemailer'
import Mail from "nodemailer/lib/mailer";
import { config } from '../config';
import { t } from '../i18n';
const smtpTransport = require('nodemailer-smtp-transport');

interface EmailAddress {
    email: string;
    name: string;
}

interface FeedbackEmail {
    enviados: string[],
    rejeitados: string[],
    message?: string
}

export interface Mensagem {
    to: Partial<EmailAddress>;
    from: EmailAddress;
    subject: string;
    body: string;
}

export interface Provedor {
    enviar(message: Mensagem): Promise<FeedbackEmail>;
}

export class Email implements Provedor {
    private static instance: Email;
    private transporter: Mail;

    constructor() {

        this.transporter = nodemailer.createTransport(smtpTransport(
            {
                host: "smtp.titan.email",
                port: config.email.port,
                secure: config.email.secure,
                service: config.email.service,
                auth: {
                    user: config.email.user,
                    pass: config.email.password
                },
                tls: {
                    rejectUnauthorized: false
                },
                pool: true
            }
        ));
    }

    static getInstance(): Email {
        if (!Email.instance) {
            Email.instance = new Email();
        }

        return Email.instance;
    }

    async enviar(message: Mensagem): Promise<FeedbackEmail> {
        const { accepted, rejected } = await this.transporter.sendMail({
            to: {
                name: message.to.name,
                address: message.to.email,
            },
            from: {
                name: message.from.name || '',
                address: message.from.email,
            },
            subject: message.subject,
            html: message.body,
        });

        if (accepted?.length >= 0 && rejected?.length >= 0) {
            return Promise.resolve({ enviados: accepted, rejeitados: rejected });
        }

        return Promise.reject({
            enviados: [],
            rejeitados: [message.to.email],
            message: t('messages:falha-email')
        })
    }
}
