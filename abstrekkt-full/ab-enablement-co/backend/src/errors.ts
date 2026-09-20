export class AppError extends Error {
  constructor(public readonly code: string, message: string, public readonly status = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export function toHttpError(error: unknown): { status: number; body: { error: string; message: string } } {
  if (error instanceof AppError) {
    return { status: error.status, body: { error: error.code, message: error.message } };
  }
  return { status: 500, body: { error: 'internal_error', message: 'Unexpected server error.' } };
}
