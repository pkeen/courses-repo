import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/schema"; // Adjust if schema lives elsewhere

// Create a connection pool to the test database running in Docker
const pool = new Pool({
	host: "localhost",
	port: 5433,
	user: "test",
	password: "test",
	database: "courses_test",
	ssl: false, // Important! Matches drizzle.config.ts to avoid the SSL error
});

// Export the Drizzle database instance using your schema
export const db = drizzle(pool, { schema });

export type DB = typeof db
