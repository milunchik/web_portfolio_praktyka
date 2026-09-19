import { Injectable, OnModuleInit } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { AppConfigService } from '../../config/config.service';
import { MailProvider } from '../mail.provider';
import { MailMessage } from '../mail.types';

type MailTransporter = {
  sendMail: (options: {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
  }) => Promise<unknown>;
};

@Injectable()
export class SmtpMailProvider extends MailProvider implements OnModuleInit {
  private transporter: MailTransporter | null = null;

  constructor(private readonly config: AppConfigService) {
    super();
  }

  onModuleInit(): void {
    const mail = this.config.mail;

    if (!mail.host || !mail.port || !mail.user || !mail.pass || !mail.from) {
      this.transporter = null;
      return;
    }

    const options: SMTPTransport.Options = {
      host: mail.host,
      port: mail.port,
      secure: false,
      auth: { user: mail.user, pass: mail.pass },
    };

    this.transporter = nodemailer.createTransport(options);
  }

  async send(message: MailMessage): Promise<void> {
    if (!this.transporter) return;

    const mail = this.config.mail;
    if (!mail.from) return;

    await this.transporter.sendMail({
      from: `"App" <${mail.from}>`,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
  }
}
