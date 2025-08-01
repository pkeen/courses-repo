import { courses } from "@/courses";
import { notFound } from "next/navigation";
// import { CourseEditForm } from "@/lib/components/course-builder/course/course-edit-form";
// import { CourseEditForm } from "@/lib/components/course-builder/course/course-edit-form-display";
import { CourseEditForm } from "@pete_keen/courses-ui";

export default async function CourseEditPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;
	const course = await courses.course.get(parseInt(id, 10));
	const contentItems = (await courses.content.list()) ?? [];
	if (!course) return notFound();
	return (
		<CourseEditForm
			course={course}
			existingContent={contentItems}
			// existingModules={existingModules}
			onSubmit={async (values) => {
				"use server";
				await courses.course.update(values);
				return values;
			}}
			onDelete={async (id) => {
				"use server";
				await courses.course.destroy(id);
			}}
		/>
	);
}
