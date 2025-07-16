// "use client";
import { CourseDTO } from "@pete_keen/courses-core/types";
import { Button } from "../../../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CoursesTable } from "./CoursesTable";

type CoursesViewProps = {
	courses: CourseDTO[];
	onAddCourseHref: string;
	handleDelete: (id: number) => Promise<void>;
};

export function CoursesAdminView({
	courses,
	onAddCourseHref,
	handleDelete,
}: CoursesViewProps) {
	return (
		<div className="space-y-4">
			<Button variant="default" size="sm" asChild>
				<Link
					href={onAddCourseHref}
					className="flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Course
				</Link>
			</Button>
			<CoursesTable courses={courses} handleDelete={handleDelete} />
		</div>
	);
}
