import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);

    const originPassword = '123456';

    const hashVal = await service.hash(originPassword);
    console.log('hashVal ------', hashVal, hashVal.length);

    const isValidate1 = await service.verify('12121', hashVal);
    const isValidate2 = await service.verify(originPassword, hashVal);

    console.log('isValidate1 ------', isValidate1);
    console.log('isValidate2 ------', isValidate2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
