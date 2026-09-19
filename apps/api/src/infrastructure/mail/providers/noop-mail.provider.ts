import { Injectable } from '@nestjs/common';
import { MailProvider } from '../mail.provider';
import { MailMessage } from '../mail.types';

@Injectable()
export class NoopMailProvider extends MailProvider {
  send(_: MailMessage): Promise<void> {
    void _;
    return Promise.resolve();
  }
}
