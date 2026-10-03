import { Module } from "@nestjs/common";

import { QueueLifecycleService } from "./queue/queue-lifecycle.service.js";

@Module({
  providers: [QueueLifecycleService],
})
export class WorkerModule {}
