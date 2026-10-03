import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

const { Pool } = pg;

export type TelDatabase = Record<string, never>;

export type PostgresDatabaseOptions = {
  readonly connectionString: string;
  readonly maxConnections?: number;
};

export function createPostgresDatabase(
  options: PostgresDatabaseOptions,
): Kysely<TelDatabase> {
  return new Kysely<TelDatabase>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: options.connectionString,
        max: options.maxConnections ?? 10,
      }),
    }),
  });
}
