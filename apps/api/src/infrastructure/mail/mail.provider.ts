import { MailMessage } from './mail.types.js';

export abstract class MailProvider {
  abstract send(message: MailMessage): Promise<void>;
}
