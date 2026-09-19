import { MailMessage } from '../../../infrastructure/mail/mail.types';

export abstract class MailPort {
  abstract send(message: MailMessage): Promise<void>;
  abstract flush(): Promise<void>;
}
