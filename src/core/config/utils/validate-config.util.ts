import type { StringValue as MsStringValue } from 'ms';
import ms from 'ms';
import { z, ZodError } from 'zod';

function emptyStringToUndefined(value: unknown): unknown {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
}

export const requiredEnvStringSchema = z.string().trim().min(1);

export function envStringSchema(defaultValue: string) {
  return z.string().trim().default(defaultValue);
}

export const optionalEnvStringSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(1).optional(),
);

export function envIntegerSchema(defaultValue: number, minimumValue = 0) {
  return z.coerce.number().int().gte(minimumValue).default(defaultValue);
}

export const envBooleanSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
      return true;
    }

    if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
      return false;
    }
  }

  return value;
}, z.boolean());

export function envMsDurationSchema(defaultValue: MsStringValue) {
  return z
    .string()
    .trim()
    .default(defaultValue)
    .refine((value) => {
      try {
        const milliseconds = ms(value as MsStringValue);
        return typeof milliseconds === 'number' && !Number.isNaN(milliseconds);
      } catch {
        return false;
      }
    }, 'Must be a valid ms duration string (for example "1h" or "30d")')
    .transform((value) => value as MsStringValue);
}

export function validateAndTransformConfig<T>(
  schema: z.ZodType<T>,
  rawConfigValues: Record<string, unknown>,
  configNamespace: string = 'Configuration',
): T {
  try {
    return schema.parse(rawConfigValues);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const messages = error.issues
        .map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          return `${path}: ${issue.message}`;
        })
        .join('; ');

      throw new Error(`[${configNamespace}] Validation failed: ${messages}`);
    }

    throw error;
  }
}
