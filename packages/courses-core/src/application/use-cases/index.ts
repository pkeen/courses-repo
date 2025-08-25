import { CourseRepo, ContentItemRepo, DBAdapter } from "../ports";

export interface CourseManager {
	// create: (input: CourseInput) => Promise<Course>;
	// update: (id: string, input: Partial<CourseInput>) => Promise<Course>;
	// delete: (id: string) => Promise<void>;
	// list: () => Promise<Course[]>;
	// getCourse: (id: string) => Promise<Course | null>;
	// module: ModuleCRUD;
	// lesson: LessonCRUD;
	course: CourseRepo; // but these dont need to be the same as the repo ports actually
	content: ContentItemRepo;
}

// const dbAdapter = DrizzlePGAdapter(db);

export const CourseManager = (dbAdapter: DBAdapter): CourseManager => {
	return {
		course: dbAdapter.course,
		content: dbAdapter.content,
	};
};
