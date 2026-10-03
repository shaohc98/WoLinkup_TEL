import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

type HealthResponse = {
  readonly service: "tel-api";
  readonly status: "ok";
  readonly timestamp: string;
};

@ApiTags("platform")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Read the TEL API process health" })
  @ApiOkResponse({ description: "The API process is available." })
  getHealth(): HealthResponse {
    return {
      service: "tel-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
