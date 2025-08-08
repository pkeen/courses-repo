import { courses } from "@/courses";
import { CoursesAdminView } from "@pete_keen/courses-ui";

export default async function CoursesPage() {
	const coursesList = await courses.course.list();

	return (
		<CoursesAdminView
			courses={coursesList}
			onAddCourseHref="/admin/courses/new"
			handleDelete={async (id) => {
				"use server";
				await courses.course.destroy(id);
			}}
		/>
	);
}
