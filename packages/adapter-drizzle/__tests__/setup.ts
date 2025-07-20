import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

export async function setupTestDB() {
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });
}
