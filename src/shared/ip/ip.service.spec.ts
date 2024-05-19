import { Test, TestingModule } from '@nestjs/testing';
import { IpService } from './ip.service';

describe('IpService', () => {
  let service: IpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpService],
    }).compile();

    service = module.get<IpService>(IpService);

    const paseResult = service.resolveIp('192.168.0.1');
    console.log('paseResult ------', paseResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
