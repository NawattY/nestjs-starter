export function handleException<T extends Error>(
  err: T,
  message: string,
  exceptionFactory: (message: string, error?: string) => Error,
): Error {
  const errorMessage = err?.message || 'Unexpected error';
  return exceptionFactory(message, errorMessage);
}
