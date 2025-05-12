type ErrorSeverity = "low" | "medium" | "high" | "critical"

type ErrorLogData = {
  message: string
  code?: string
  userId?: string
  path?: string
  component?: string
  timestamp: string
  severity: ErrorSeverity
  stack?: string
  context?: Record<string, any>
}

/**
 * Comprehensive error logging utility for Code Homie
 */
export class ErrorLogger {
  private static instance: ErrorLogger
  private isEnabled = true
  private logEndpoint = "/api/logs/error"

  private constructor() {}

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * Log an error with detailed context
   */
  public async logError(
    error: Error | string,
    severity: ErrorSeverity = "medium",
    context: Record<string, any> = {},
  ): Promise<void> {
    if (!this.isEnabled) return

    try {
      const errorMessage = typeof error === "string" ? error : error.message
      const errorStack = typeof error === "string" ? undefined : error.stack

      // Get user ID if available
      let userId: string | undefined
      try {
        const supabase = (window as any).supabase
        if (supabase) {
          const { data } = await supabase.auth.getSession()
          userId = data?.session?.user?.id
        }
      } catch (e) {
        // Silently fail if we can't get the user ID
      }

      // Get current path
      const path = typeof window !== "undefined" ? window.location.pathname : undefined

      const logData: ErrorLogData = {
        message: errorMessage,
        userId,
        path,
        timestamp: new Date().toISOString(),
        severity,
        stack: errorStack,
        context,
      }

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("ERROR LOG:", logData)
      }

      // Send to backend logging endpoint
      await this.sendToServer(logData)
    } catch (loggingError) {
      // Fallback to basic console logging if our logger fails
      console.error("Error logger failed:", loggingError)
      console.error("Original error:", error)
    }
  }

  /**
   * Send error data to the server
   */
  private async sendToServer(logData: ErrorLogData): Promise<void> {
    try {
      const response = await fetch(this.logEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      })

      if (!response.ok) {
        throw new Error(`Error logging failed with status: ${response.status}`)
      }
    } catch (e) {
      // Silently fail if we can't send to server
      // We don't want to create an infinite loop of errors
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to send error log to server:", e)
      }
    }
  }

  /**
   * Enable or disable error logging
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Change the endpoint for error logging
   */
  public setLogEndpoint(endpoint: string): void {
    this.logEndpoint = endpoint
  }
}

/**
 * Convenience function to log errors
 */
export function logError(
  error: Error | string,
  severity: ErrorSeverity = "medium",
  context: Record<string, any> = {},
): void {
  ErrorLogger.getInstance().logError(error, severity, context)
}
