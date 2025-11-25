/**
 * Common Status Enum
 *
 * Generic status enum used across multiple modules.
 * Database stores values as lowercase strings (e.g., 'active', 'inactive').
 */
export enum CommonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/**
 * Type alias for CommonStatus values
 * Useful for type annotations and ensuring type safety
 */
export type CommonStatusType = `${CommonStatus}`;

/**
 * Array of all CommonStatus values
 * Useful for validation and iteration
 */
export const COMMON_STATUS_VALUES = Object.values(CommonStatus);

/**
 * Human-readable labels for CommonStatus
 * Maps enum values to user-friendly display text
 *
 * @example
 * COMMON_STATUS_LABELS[CommonStatus.ACTIVE] // "Active"
 * COMMON_STATUS_LABELS['wait_for_approve'] // "Wait for Approve"
 */
export const COMMON_STATUS_LABELS: Record<CommonStatus, string> = {
  [CommonStatus.ACTIVE]: 'Active',
  [CommonStatus.INACTIVE]: 'Inactive',
  [CommonStatus.SUSPENDED]: 'Suspended',
};

/**
 * Get human-readable label for a CommonStatus value
 *
 * @param status - CommonStatus enum value
 * @returns Human-readable label string
 *
 * @example
 * getCommonStatusLabel(CommonStatus.ACTIVE) // "Active"
 * getCommonStatusLabel('inactive') // "Inactive"
 */
export function getCommonStatusLabel(status: CommonStatus | string): string {
  return COMMON_STATUS_LABELS[status as CommonStatus] || status;
}
