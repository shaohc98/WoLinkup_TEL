import type { SupplierAdapter } from "@wolinkup/supplier-spi";

export class SupplierAdapterRegistry {
  private readonly adapters = new Map<string, SupplierAdapter>();

  register(adapter: SupplierAdapter): void {
    if (this.adapters.has(adapter.supplierId)) {
      throw new Error(
        `Supplier adapter already registered: ${adapter.supplierId}`,
      );
    }
    this.adapters.set(adapter.supplierId, adapter);
  }

  require(supplierId: string): SupplierAdapter {
    const adapter = this.adapters.get(supplierId);
    if (!adapter) {
      throw new Error(`Supplier adapter is not registered: ${supplierId}`);
    }
    return adapter;
  }
}
