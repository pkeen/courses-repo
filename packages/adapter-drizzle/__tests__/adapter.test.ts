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
import { resetTable, resetTables } from "./utils/resetTables";
import { DrizzlePGAdapter, createCoursesDBAdapter } from "../src/adapter";
import { seed } from "./utils/seed";
import { eq } from "drizzle-orm";

// const schema = createSchema();
// const adapter = DrizzlePGAdapter(db)

const { adapter, schema } = createCoursesDBAdapter(db);

beforeAll(async () => {
	console.warn("running migrations");
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });
	console.log("✅ Migrations finished");

	// Seeding
	await seed(db, schema);
});

beforeEach(async () => {
	// await resetTables(db, tablesArray);
});

describe("Basic DB test", () => {
	it("inserts and reads back a content item", async () => {
		const newContent = await db
			.insert(schema.contentItem)
			.values({
				title: "Hello, world!",
				type: "lesson",
				isPublished: true,
				updatedAt: new Date(),
			})
			.returning();

		const results = await db
			.select()
			.from(schema.contentItem)
			.where(eq(schema.contentItem.title, "Hello, world!"));

		expect(results.length).toBe(1);
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
