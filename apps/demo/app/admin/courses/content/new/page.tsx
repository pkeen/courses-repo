import { NewModuleForm } from "@/lib/components/course-builder/modules/new-module-form";
import { courses } from "@/courses";

export default async function NewModulePage() {
	const existingLessons = await courses.lesson.list();
	return <NewModuleForm existingLessons={existingLessons} />;
}
