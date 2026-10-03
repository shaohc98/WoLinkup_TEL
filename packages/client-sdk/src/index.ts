import type { HealthResponse } from "@wolinkup/api-contracts";

export type TelApiClientOptions = {
  readonly baseUrl: string;
  readonly fetch?: typeof globalThis.fetch;
};

export class TelApiClient {
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof globalThis.fetch;

  constructor(options: TelApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.fetchImplementation = options.fetch ?? globalThis.fetch;
  }

  async health(): Promise<HealthResponse> {
    const response = await this.fetchImplementation(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`TEL API health request failed with ${response.status}`);
    }
    return (await response.json()) as HealthResponse;
  }
}
