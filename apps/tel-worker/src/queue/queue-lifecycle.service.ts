import {
  Injectable,
  Logger,
  type OnApplicationShutdown,
  type OnModuleInit,
} from "@nestjs/common";
import { PgBoss } from "pg-boss";

@Injectable()
export class QueueLifecycleService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(QueueLifecycleService.name);
  private boss?: PgBoss;

  async onModuleInit(): Promise<void> {
    if (process.env.WORKER_QUEUE_ENABLED !== "true") {
      this.logger.warn(
        "Persistent queue is disabled; set WORKER_QUEUE_ENABLED=true to connect pg-boss.",
      );
      return;
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is required when the worker queue is enabled",
      );
    }

    this.boss = new PgBoss({
      connectionString,
      schema: process.env.PG_BOSS_SCHEMA ?? "platform_jobs",
    });
    await this.boss.start();
    this.logger.log("pg-boss started");
  }

  async onApplicationShutdown(): Promise<void> {
    await this.boss?.stop({ graceful: true, timeout: 30_000 });
  }
}
