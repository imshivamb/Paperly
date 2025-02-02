import { toast } from "@/hooks/use-toast"


interface ErrorOptions {
  silent?: boolean
  customMessage?: string
}

export function handleError(error: unknown, options: ErrorOptions = {}) {
  console.error("Error occurred:", error)

  if (options.silent) return

  let message = options.customMessage || "An unexpected error occurred"

  if (error instanceof Error) {
    if (error.message.includes("Unauthorized")) {
      message = "You need to be signed in to perform this action"
    } else if (error.message.includes("not found")) {
      message = "The requested resource was not found"
    } else if (error.message.includes("UNIQUE constraint failed")) {
      message = "This item already exists"
    }
  }

  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  })
}

export function handleSuccess(message: string) {
  toast({
    title: "Success",
    description: message,
  })
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function catchErrors<T extends any[], R>(
  handler: (...args: T) => Promise<R> | R
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };
}