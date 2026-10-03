import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { WorkerModule } from "./worker.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });
  app.enableShutdownHooks();

  new Logger("Bootstrap").log("TEL worker application context started");
}

void bootstrap().catch((error: unknown) => {
  new Logger("Bootstrap").error(error);
  process.exitCode = 1;
});
