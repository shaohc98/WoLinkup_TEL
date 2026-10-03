import { z } from "zod";

const baseEnvironmentSchema = z.object({
  DATABASE_URL: z.url(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
});

export type BaseEnvironment = z.infer<typeof baseEnvironmentSchema>;

export function loadBaseEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
): BaseEnvironment {
  return baseEnvironmentSchema.parse(environment);
}
