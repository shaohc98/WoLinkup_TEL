import { trace } from "@opentelemetry/api";
import pino, { type Logger, type LoggerOptions } from "pino";

export type ServiceLoggerOptions = {
  readonly level?: string;
  readonly serviceName: string;
};

export function createServiceLogger(options: ServiceLoggerOptions): Logger {
  const loggerOptions: LoggerOptions = {
    base: { service: options.serviceName },
    level: options.level ?? "info",
    redact: {
      paths: [
        "authorization",
        "headers.authorization",
        "mobileNumber",
        "password",
        "token",
      ],
      censor: "[REDACTED]",
    },
  };

  return pino(loggerOptions);
}

export function getServiceTracer(serviceName: string) {
  return trace.getTracer(serviceName);
}
