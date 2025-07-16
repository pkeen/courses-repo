"use server";
import { CourseManager } from "@pete_keen/courses-core";

export function createActions(courses: CourseManager) {
	return {
		deleteCourse: async (id: string) => {
			return courses.course.destroy(id);
		},
		createCourse: async (data: any) => {
			return courses.course.create(data);
		},
		updateCourse: async (data: any) => {
			return courses.course.update(data);
		},
		// add others as needed
	};
}
