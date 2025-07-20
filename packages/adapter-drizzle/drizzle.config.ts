import type { Config } from "drizzle-kit";

export default {
	schema: "./src/schema.ts",
	out: "./drizzle/migrations",
	// driver: "pg",
	dialect: "postgresql",
	dbCredentials: {
		host: "localhost",
		port: 5433,
		user: "test",
		password: "test",
		database: "courses_test",
		ssl: false, // 🔴 Add this line to disable SSL
	},
} satisfies Config;
