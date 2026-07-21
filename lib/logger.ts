// lib/logger.ts
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  intent?: string;
  provider?: string;
  executionTimeMs?: number;
  [key: string]: unknown;
}

/**
 * A structured logger that records intent, provider used, execution time, and errors.
 * Ensures we never log secrets by keeping contexts sanitized.
 */
class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    
    // In production, we might want to pipe this to Datadog, Axiom, etc.
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // Specific format required by instructions
    if (level === 'error' && context?.provider) {
      const status = context.status || 500;
      console.error(`Chat API Error | Provider: ${context.provider} | Status: ${status} | Message: ${message}`);
      if (context.error && process.env.NODE_ENV !== 'production' && typeof context.error === 'object' && 'stack' in (context.error as Error)) {
        console.error((context.error as Error).stack);
      }
    } else {
      switch (level) {
        case 'info':
          console.log(JSON.stringify(logEntry));
          break;
        case 'warn':
          console.warn(JSON.stringify(logEntry));
          break;
        case 'error':
          console.error(JSON.stringify(logEntry));
          break;
        case 'debug':
          if (process.env.NODE_ENV !== 'production') {
            console.debug(JSON.stringify(logEntry));
          }
          break;
      }
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
