import { db } from "./db";
import {
	DefaultSchema,
	createSchema,
	schemaTables,
	TablesArray,
	tablesArray,
} from "../src/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { beforeAll, beforeEach, it, expect, describe } from "vitest";
import { resetTable, resetTables } from "./utils";
import { DrizzlePGAdapter, createCoursesDBAdapter } from "../src/adapter";

// const schema = createSchema();
// const adapter = DrizzlePGAdapter(db)

const { adapter, schema } = createCoursesDBAdapter(db);

beforeAll(async () => {
	console.warn("running migrations");
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });
	console.log("✅ Migrations finished");
});

beforeEach(async () => {
	await resetTables(db, tablesArray);
});

describe("Basic DB test", () => {
	it("inserts and reads back a content item", async () => {
		await db.insert(schema.contentItem).values({
			title: "Hello, world!",
			type: "lesson",
			isPublished: true,
			updatedAt: new Date(),
		});

		const results = await db.select().from(schema.contentItem);

		expect(results.length).toBe(1);
		expect(results[0].title).toBe("Hello, world!");
	});
});

// it("can insert content", async () => {
// 	await db.insert(schema.contentItem).values({
// 		title: "Test",
// 		type: "lesson",
// 		isPublished: true,
// 		updatedAt: new Date(),
// 	});
// 	const results = await db.select().from(schema.contentItem);
// 	expect(results.length).toBe(1);
// });
