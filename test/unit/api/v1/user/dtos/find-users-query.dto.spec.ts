import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FindUsersQueryDto } from '#api/v1/user/dtos/requests/find-users-query.dto';
import { DEFAULT_PAGINATION } from '#constants/pagination.constant';

describe('FindUsersQueryDto', () => {
  describe('inheritance from PaginateQueryDto', () => {
    it('should have default values from DEFAULT_PAGINATION', () => {
      const dto = new FindUsersQueryDto();
      expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
      expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
    });

    it('should accept pagination parameters', () => {
      const testData: any = {
        page: 2,
        perPage: 50,
      };
      const dto = plainToInstance(FindUsersQueryDto, testData);
      expect(dto.page).toBe(2);
      expect(dto.perPage).toBe(50);
    });
  });

  describe('page validation and transformation', () => {
    it('should accept valid positive integers', async () => {
      const validPages = [1, 2, 5, 10];
      
      for (const page of validPages) {
        const dto = plainToInstance(FindUsersQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        expect(dto.page).toBe(page);
      }
    });

    it('should transform numeric strings to integers', async () => {
      const numericStrings = ['1', '2', '5'];
      
      for (const page of numericStrings) {
        const dto = plainToInstance(FindUsersQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        expect(typeof dto.page).toBe('number');
        expect(Number.isInteger(dto.page)).toBe(true);
      }
    });

    it('should use default page for values less than 1', async () => {
      const invalidPages = [0, -1, -10];
      
      for (const page of invalidPages) {
        const dto = plainToInstance(FindUsersQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        // The transformation should correct invalid values
        expect(dto.page).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('perPage validation and transformation', () => {
    it('should accept valid positive integers within bounds', async () => {
      const validPerPage = [1, 5, 10, 20, 100];
      
      for (const perPage of validPerPage) {
        const dto = plainToInstance(FindUsersQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(dto.perPage).toBe(perPage);
      }
    });

    it('should cap perPage to MAX_LIMIT for oversized values', async () => {
      const oversizedValues = [150, 999];
      
      for (const perPage of oversizedValues) {
        const dto = plainToInstance(FindUsersQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(dto.perPage).toBeLessThanOrEqual(DEFAULT_PAGINATION.MAX_LIMIT);
      }
    });

    it('should use default limit for values less than 1', async () => {
      const invalidPerPage = [0, -1];
      
      for (const perPage of invalidPerPage) {
        const dto = plainToInstance(FindUsersQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(dto.perPage).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('combined validation', () => {
    it('should handle both page and perPage transformation correctly', async () => {
      const testCases = [
        { input: { page: 2, perPage: 50 }, expectedPage: 2, expectedPerPage: 50 },
        { input: { page: '3', perPage: '25' }, expectedPage: 3, expectedPerPage: 25 },
        { input: { page: 5.5, perPage: 50.7 }, expectedPage: 5, expectedPerPage: 50 },
      ];

      for (const testCase of testCases) {
        const dto = plainToInstance(FindUsersQueryDto, testCase.input);
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.page).toBe(testCase.expectedPage);
        expect(dto.perPage).toBe(testCase.expectedPerPage);
      }
    });
  });

  describe('query parameter usage', () => {
    it('should work with typical query string parameters', async () => {
      const queryParams = {
        page: '3',
        perPage: '25',
      };
      
      const dto = plainToInstance(FindUsersQueryDto, queryParams);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(3);
      expect(dto.perPage).toBe(25);
    });

    it('should handle empty query parameters', async () => {
      const queryParams = {};
      const dto = plainToInstance(FindUsersQueryDto, queryParams);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
      expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
    });
  });

  describe('type safety', () => {
    it('should maintain interface after transformation', async () => {
      const dto = plainToInstance(FindUsersQueryDto, {
        page: '5',
        perPage: '40',
      });
      
      await validate(dto);
      
      expect(typeof dto.page).toBe('number');
      expect(typeof dto.perPage).toBe('number');
      expect(Number.isInteger(dto.page)).toBe(true);
      expect(Number.isInteger(dto.perPage)).toBe(true);
    });
  });
});
