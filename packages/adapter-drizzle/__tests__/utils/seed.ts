// seed tables
import { DefaultSchema } from "../../src/schema";
import { DB } from "../db";
import * as courseSeed from "./seeds";

export const seed = async (db: DB, schema: DefaultSchema) => {
	try {
		await courseSeed.course(db, schema);
		await courseSeed.contentItem(db, schema);
		await courseSeed.courseNode(db, schema);
		await courseSeed.videoDetail(db, schema);
		await courseSeed.lessonDetail(db, schema);
		await courseSeed.fileDetail(db, schema);

		console.log("Database seeded successfully!");
	} catch (err) {
		console.error("Error seeding database:", err);
	}
};
