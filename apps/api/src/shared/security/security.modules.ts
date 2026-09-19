import { Global, Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { PasswordPort } from '../domain/ports';
import { TokenPort } from '../domain/ports';

@Global()
@Module({
  providers: [
    { provide: PasswordPort, useClass: PasswordService },
    { provide: TokenPort, useClass: TokenService },
  ],
  exports: [PasswordPort, TokenPort],
})
export class SecurityModule {}
