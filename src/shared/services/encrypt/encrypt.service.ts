import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  private _bcryptSalts = 10;

  public async encrypt(payload: string): Promise<string> {
    return bcrypt.hash(payload, this._bcryptSalts);
  }

  public async matches(payload: string, hash: string): Promise<boolean> {
    return bcrypt.compare(payload, hash);
  }
}
