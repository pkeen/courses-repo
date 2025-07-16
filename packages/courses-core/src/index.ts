// import type { CourseCRUD, LessonCRUD, ModuleCRUD } from "./types";
// import { DrizzlePGAdapter, DBAdapter } from "./db-adapters/drizzle-pg";
// import db from "~/lib/db/index.server";
// import * as schema from "~/lib/courses/db/schema";

import type { DBAdapter } from "./db-adapters";
import { CourseCRUD, ContentItemCRUD } from "types";

export interface CourseManager {
	// create: (input: CourseInput) => Promise<Course>;
	// update: (id: string, input: Partial<CourseInput>) => Promise<Course>;
	// delete: (id: string) => Promise<void>;
	// list: () => Promise<Course[]>;
	// getCourse: (id: string) => Promise<Course | null>;
	// module: ModuleCRUD;
	// lesson: LessonCRUD;
	course: CourseCRUD;
	content: ContentItemCRUD;
}

// const dbAdapter = DrizzlePGAdapter(db);

export const CourseManager = (dbAdapter: DBAdapter): CourseManager => {
	return {
		// create: async (input: CourseInput) => {
		// 	return dbAdapter.createCourse(input);
		// },
		// getCourse: async (id: string) => {
		// 	return dbAdapter.getCourse(id);
		// },
		// update: async (id: string, input: Partial<CourseInput>) => {
		// 	return dbAdapter.updateCourse(id, input);
		// },
		// delete: async (id: string) => {
		// 	return dbAdapter.deleteCourse(id);
		// },
		// list: async () => {
		// 	return dbAdapter.listCourses();
		// },
		// module: dbAdapter.module,
		// lesson: dbAdapter.lesson,
		course: dbAdapter.course,
		content: dbAdapter.content,
		// video: dbAdapter.video,
	};
};
