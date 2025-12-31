import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PaginateQueryDto } from '#shared/dto/paginate-query.dto';
import { DEFAULT_PAGINATION } from '#constants/pagination.constant';

describe('PaginateQueryDto', () => {
  describe('default values', () => {
    it('should have correct default values', () => {
      const dto = new PaginateQueryDto();
      expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
      expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
    });

    it('should use defaults when no values are provided', () => {
      const dto = plainToInstance(PaginateQueryDto, {});
      expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
      expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
    });
  });

  describe('page validation and transformation', () => {
    it('should accept valid positive integers', async () => {
      const validPages = [1, 2, 5, 10];
      
      for (const page of validPages) {
        const dto = plainToInstance(PaginateQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        expect(dto.page).toBe(page);
      }
    });

    it('should transform numeric strings to integers', async () => {
      const numericStrings = ['1', '2', '5'];
      
      for (const page of numericStrings) {
        const dto = plainToInstance(PaginateQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        expect(typeof dto.page).toBe('number');
        expect(Number.isInteger(dto.page)).toBe(true);
      }
    });

    it('should convert floats to integers', async () => {
      const floatValues = [1.5, 2.7, 10.9];
      
      for (const page of floatValues) {
        const dto = plainToInstance(PaginateQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        expect(Number.isInteger(dto.page)).toBe(true);
        expect(dto.page).toBe(Math.floor(page));
      }
    });

    it('should use default page for values less than 1', async () => {
      const invalidPages = [0, -1, -10];
      
      for (const page of invalidPages) {
        const dto = plainToInstance(PaginateQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'page')).toHaveLength(0);
        // The transformation should correct invalid values
        expect(dto.page).toBeGreaterThanOrEqual(DEFAULT_PAGINATION.PAGE);
      }
    });
  });

  describe('perPage validation and transformation', () => {
    it('should accept valid positive integers within bounds', async () => {
      const validPerPage = [1, 5, 10, 20, 100];
      
      for (const perPage of validPerPage) {
        const dto = plainToInstance(PaginateQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(dto.perPage).toBe(perPage);
      }
    });

    it('should transform numeric strings to integers', async () => {
      const numericStrings = ['1', '5', '10', '20'];
      
      for (const perPage of numericStrings) {
        const dto = plainToInstance(PaginateQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(typeof dto.perPage).toBe('number');
        expect(Number.isInteger(dto.perPage)).toBe(true);
      }
    });

    it('should cap perPage to MAX_LIMIT for oversized values', async () => {
      const oversizedValues = [150, 999];
      
      for (const perPage of oversizedValues) {
        const dto = plainToInstance(PaginateQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(dto.perPage).toBe(DEFAULT_PAGINATION.MAX_LIMIT);
      }
    });

    it('should use default limit for values less than 1', async () => {
      const invalidPerPage = [0, -1];
      
      for (const perPage of invalidPerPage) {
        const dto = plainToInstance(PaginateQueryDto, { perPage });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
      }
    });

    it('should convert floats to integers and apply bounds', async () => {
      const testCases = [
        { input: 1.5, expected: 1 },
        { input: 20.7, expected: 20 },
        { input: 100.9, expected: 100 },
        { input: 150.5, expected: DEFAULT_PAGINATION.MAX_LIMIT }, // Capped at max
      ];
      
      for (const testCase of testCases) {
        const dto = plainToInstance(PaginateQueryDto, { perPage: testCase.input });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'perPage')).toHaveLength(0);
        expect(Number.isInteger(dto.perPage)).toBe(true);
        expect(dto.perPage).toBe(testCase.expected);
      }
    });
  });

  describe('combined behavior', () => {
    it('should handle both page and perPage transformation correctly', async () => {
      const testCases = [
        { input: { page: 2, perPage: 50 }, expected: { page: 2, perPage: 50 } },
        { input: { page: '3', perPage: '25' }, expected: { page: 3, perPage: 25 } },
        { input: { page: 5.5, perPage: 50.7 }, expected: { page: 5, perPage: 50 } },
        { input: { page: 1, perPage: 150 }, expected: { page: 1, perPage: DEFAULT_PAGINATION.MAX_LIMIT } },
      ];

      for (const testCase of testCases) {
        const dto = plainToInstance(PaginateQueryDto, testCase.input);
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.page).toBe(testCase.expected.page);
        expect(dto.perPage).toBe(testCase.expected.perPage);
      }
    });
  });

  describe('interface compliance', () => {
    it('should implement PaginatedRequestInterface correctly', () => {
      const dto = plainToInstance(PaginateQueryDto, {
        page: 2,
        perPage: 30,
      });

      expect(dto).toHaveProperty('page');
      expect(dto).toHaveProperty('perPage');
      expect(typeof dto.page).toBe('number');
      expect(typeof dto.perPage).toBe('number');
    });

    it('should maintain interface after transformation', async () => {
      const dto = plainToInstance(PaginateQueryDto, {
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
