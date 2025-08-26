// @me/courses-contracts/src/service.ts
import type { CourseDTO } from "@pete_keen/courses-core/entities"; // you already export this via zod

export interface CoursesService {
	list(): Promise<CourseDTO[]>;
	get(id: number): Promise<CourseDTO>;
	destroy(id: number): Promise<void>;
	// add create/update as you need for the UI
}
6;
