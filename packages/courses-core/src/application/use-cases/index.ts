/*
 * This is the application layer\
    These shapes do not need to match the repo port shapes exactly. 
    Some functions can be changed here and application logic applied, e.g. Authorization
    All logic for “what actions are allowed and in what order” lives here.
*/

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
		content: dbAdapter.content, // it may be here that in file content we actually call the fileStorage API before passing it on as contentItem to repo
		// Similarly courses will need to store files for images
		// And for video content thumbnails or saving videos
	};
};
