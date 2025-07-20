import { Pool } from "pg";

const pool = new Pool({
	host: "localhost",
	port: 5433,
	user: "test",
	password: "test",
	database: "courses_test",
	ssl: false, // Make sure this matches drizzle.config.ts
});

(async () => {
	const start = Date.now();
	while (Date.now() - start < 10000) {
		try {
			await pool.query("SELECT 1"); // ✅ This only works if imported from 'pg'
			console.log("✅ DB is ready");
			process.exit(0);
		} catch (err) {
			console.log("Waiting for DB...");
			await new Promise((r) => setTimeout(r, 500));
		}
	}
	console.error("❌ Timed out waiting for DB");
	process.exit(1);
})();
