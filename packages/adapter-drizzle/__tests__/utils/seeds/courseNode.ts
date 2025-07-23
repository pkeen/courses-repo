import type { DB } from "../../db";
import { DefaultSchema } from "../../../src/schema";
import { faker } from "@faker-js/faker";
import type { CourseNodeDTO } from "@pete_keen/courses-core/validators";

const seed = async (db: DB, schema: DefaultSchema) => {
	const spoofCourseNodeArray: Omit<CourseNodeDTO, "id">[] = [];

	for (let i = 0; i < 100; i++) {
		const spoofCourseNode = {
			courseId: Math.ceil(Math.random() * 20), // 'cultivate synergistic e-markets'
			parentId: null,
			order: Math.ceil(Math.random() * 10), // 'cultivate synergistic e-markets'
			contentId: Math.ceil(Math.random() * 60), // 'cultivate synergistic e-markets'
		};
		spoofCourseNodeArray.push(spoofCourseNode);
	}

	try {
		await db.insert(schema.courseNode).values(spoofCourseNodeArray);
		console.log("course nodes succesfully seeded...");
	} catch (error) {
		console.error("Error inserting course nodes:", error);
	}
};

export default seed;
