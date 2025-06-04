/**
 * Debug logger utility
 * Controlled by NEXT_PUBLIC_DEBUG environment variable
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDebugEnabled: boolean;

  constructor() {
    this.isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'on' || process.env.NEXT_PUBLIC_DEBUG === 'true';
  }

  private log(level: LogLevel, component: string, message: string, data?: unknown) {
    if (!this.isDebugEnabled && level === 'debug') {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${component}]`;
    
    if (data !== undefined) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  debug(component: string, message: string, data?: unknown) {
    this.log('debug', component, message, data);
  }

  info(component: string, message: string, data?: unknown) {
    this.log('info', component, message, data);
  }

  warn(component: string, message: string, data?: unknown) {
    this.log('warn', component, message, data);
  }

  error(component: string, message: string, data?: unknown) {
    this.log('error', component, message, data);
  }

  // Convenience method for chat-specific logging
  chat(component: string, action: string, data?: unknown) {
    this.debug(`CHAT-${component}`, action, data);
  }

  // Method to track component renders
  render(component: string, props?: unknown) {
    this.debug(`RENDER-${component}`, 'Component rendering', props);
  }

  // Method to track hook calls
  hook(component: string, hookName: string, data?: unknown) {
    this.debug(`HOOK-${component}`, `${hookName} called`, data);
  }
}

export const logger = new Logger(); 