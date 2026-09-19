import { Test, TestingModule } from '@nestjs/testing';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { UserRepository } from '../repositories/user.repository';

describe('FindUserByIdService', () => {
  let service: FindUserByIdService;

  const mockUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<FindUserByIdService>(FindUserByIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
