// import { CourseCRUD, ContentItemCRUD, DBAdapter } from "./ports";

// export interface CourseManager {
// 	// create: (input: CourseInput) => Promise<Course>;
// 	// update: (id: string, input: Partial<CourseInput>) => Promise<Course>;
// 	// delete: (id: string) => Promise<void>;
// 	// list: () => Promise<Course[]>;
// 	// getCourse: (id: string) => Promise<Course | null>;
// 	// module: ModuleCRUD;
// 	// lesson: LessonCRUD;
// 	course: CourseCRUD;
// 	content: ContentItemCRUD;
// }

// // const dbAdapter = DrizzlePGAdapter(db);

// export const CourseManager = (dbAdapter: DBAdapter): CourseManager => {
// 	return {
// 		course: dbAdapter.course,
// 		content: dbAdapter.content,
// 	};
// };

export * from "./utilities";
export * from "./application/use-cases";
