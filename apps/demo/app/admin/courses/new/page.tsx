import { courses } from "@/courses";
import { NewCourseForm } from "@/lib/components/course-builder/course/new-course-form";
import { thia } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewCoursePage() {
	const existingLessons = await courses.lesson.list();
	const existingModules = await courses.module.list();
	const user = await thia();
	if (!user) {
		return redirect("/api/thia/signin");
	}
	return (
		<div className="space-y-4">
			<NewCourseForm
				existingLessons={existingLessons}
				existingModules={existingModules}
				userId={user.id}
			/>
		</div>
	);
}
