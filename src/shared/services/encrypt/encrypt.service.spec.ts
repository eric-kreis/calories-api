import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from './encrypt.service';

describe('EncryptService', () => {
  let service: EncryptService;

  const payload = 'secret pass';
  let hash: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptService],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt()', () => {
    it('should return payload\'s hash', async () => {
      hash = await service.encrypt(payload);
      expect(typeof hash).toBe('string');
    });
  });

  describe('matches()', () => {
    it('should return "true" when matching the payload with generated hash', async () => {
      expect(await service.matches(payload, hash)).toBeTruthy();
    });

    it('should return to  payload with the generated hash', async () => {
      expect(await service.matches('wrong payload', hash)).toBeFalsy();
    });
  });
});
