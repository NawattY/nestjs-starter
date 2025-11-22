import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleService } from '../../../../src/business/user/user-role.service';
import { PrismaService } from '../../../../src/core/database/prisma.service';

const mockPrismaService = {
  adminProfile: { findUnique: jest.fn() },
  customer: { findUnique: jest.fn() },
  merchant: { findFirst: jest.fn() },
  merchantStaffProfile: { findFirst: jest.fn() },
  merchantCustomer: { findFirst: jest.fn() },
};

describe('UserRoleService', () => {
  let service: UserRoleService;
  let prisma: any;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserRoleService>(UserRoleService);
    prisma = module.get(PrismaService);
  });

  describe('isAdmin', () => {
    it('should return true if admin profile exists', async () => {
      mockPrismaService.adminProfile.findUnique.mockResolvedValue({ id: '1' });
      expect(await service.isAdmin('user1')).toBe(true);
    });

    it('should return false if admin profile does not exist', async () => {
      mockPrismaService.adminProfile.findUnique.mockResolvedValue(null);
      expect(await service.isAdmin('user1')).toBe(false);
    });
  });

  describe('isCustomer', () => {
    it('should return true if customer profile exists', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue({ id: '1' });
      expect(await service.isCustomer('user1')).toBe(true);
    });

    it('should return false if customer profile does not exist', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);
      expect(await service.isCustomer('user1')).toBe(false);
    });
  });

  describe('isMerchantOwner', () => {
    it('should return true if merchant owner', async () => {
      mockPrismaService.merchant.findFirst.mockResolvedValue({ id: '1' });
      expect(await service.isMerchantOwner('user1', 'merchantId')).toBe(true);
    });

    it('should return false if not merchant owner', async () => {
      mockPrismaService.merchant.findFirst.mockResolvedValue(null);
      expect(await service.isMerchantOwner('user1', 'merchantId')).toBe(false);
    });
  });

  describe('isStaff', () => {
    it('should return true if staff', async () => {
      mockPrismaService.merchantStaffProfile.findFirst.mockResolvedValue({ id: '1' });
      expect(await service.isStaff('user1', 'merchantId')).toBe(true);
    });

    it('should return false if not staff', async () => {
      mockPrismaService.merchantStaffProfile.findFirst.mockResolvedValue(null);
      expect(await service.isStaff('user1', 'merchantId')).toBe(false);
    });
  });

  describe('isCustomerOfMerchant', () => {
    it('should return true if customer of merchant', async () => {
      mockPrismaService.merchantCustomer.findFirst.mockResolvedValue({ id: '1' });
      expect(await service.isCustomerOfMerchant('user1', 'merchantId')).toBe(true);
    });

    it('should return false if not customer of merchant', async () => {
      mockPrismaService.merchantCustomer.findFirst.mockResolvedValue(null);
      expect(await service.isCustomerOfMerchant('user1', 'merchantId')).toBe(false);
    });
  });
});
