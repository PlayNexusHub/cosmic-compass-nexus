/**
 * Production-grade logging utility for SatellitePro
 * PlayNexus - Secure, structured logging with PII redaction
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private static instance: Logger;
  private level: LogLevel;
  private sessionId: string;
  private isProduction: boolean;

  private constructor() {
    this.level = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
    this.sessionId = this.generateSessionId();
    this.isProduction = import.meta.env.PROD;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeData(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data as Record<string, unknown> };
    
    // Redact sensitive fields
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    
    for (const [key, value] of Object.entries(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      }
    }

    return sanitized;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` | Error: ${entry.error.message}\nStack: ${entry.error.stack}` : '';
    
    return `[${entry.timestamp}] ${levelName}: ${entry.message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (level > this.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? this.sanitizeData(context) as Record<string, unknown> : undefined,
      error,
      sessionId: this.sessionId,
    };

    const formattedMessage = this.formatLogEntry(entry);

    // In production, only use console.error for errors
    if (this.isProduction) {
      if (level === LogLevel.ERROR) {
        console.error(formattedMessage);
      }
      // Send to external logging service in production
      this.sendToExternalService(entry);
    } else {
      // Development logging
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.log(formattedMessage);
          break;
      }
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // In a real production app, send to services like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - DataDog for monitoring
    // - Custom analytics endpoint
    
    if (entry.level === LogLevel.ERROR && typeof window !== 'undefined') {
      // Store critical errors locally as fallback
      try {
        const errors = JSON.parse(localStorage.getItem('satellitepro_errors') || '[]');
        errors.push({
          ...entry,
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
        // Keep only last 10 errors
        if (errors.length > 10) {
          errors.splice(0, errors.length - 10);
        }
        localStorage.setItem('satellitepro_errors', JSON.stringify(errors));
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Performance logging
  performance(operation: string, duration: number, context?: Record<string, unknown>): void {
    this.info(`Performance: ${operation} took ${duration}ms`, context);
  }

  // User action tracking (privacy-compliant)
  userAction(action: string, context?: Record<string, unknown>): void {
    this.info(`User Action: ${action}`, context);
  }

  setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const logger = Logger.getInstance();
