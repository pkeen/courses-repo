"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../ui/table";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input"; // import the Input component
import { MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { CourseDTO } from "@pete_keen/courses-core/types";
import { ConfirmDeleteCourseDialog } from "../ConfirmDeleteCourseDialog";
// import { deleteCourse } from "@/lib/actions/course/deleteCourse";
import { toast } from "sonner";

export function CoursesTable({
	courses,
	handleDelete,
}: {
	courses: CourseDTO[];
	handleDelete: (id: number) => Promise<void>;
}) {
	const [allCourses, setAllCourses] = useState(courses);
	const [search, setSearch] = useState("");
	const [courseToDelete, setCourseToDelete] = useState<CourseDTO | null>(
		null
	);

	// console.log("courseToDelete", courseToDelete);

	const filteredCourses = allCourses.filter((course) =>
		`${course.title} ${course.description}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);

	const handleDeleteCourse = async (courseId: number) => {
		try {
			await handleDelete(courseId);
			setAllCourses((prev) => prev.filter((c) => c.id !== courseId));
			setCourseToDelete(null);
			toast.success("Course deleted!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong deleting the course.");
		}
	};
	return (
		<div className="space-y-4">
			<ConfirmDeleteCourseDialog
				onConfirm={() => handleDeleteCourse(courseToDelete?.id)}
				open={!!courseToDelete}
				setOpen={(open) => {
					if (!open) setCourseToDelete(null);
				}}
			/>
			<Input
				placeholder="Search courses..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-left">Title</TableHead>
						<TableHead className="text-left">Excerpt</TableHead>
						<TableHead className="text-left">Published</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredCourses.map((course) => (
						<TableRow key={course.id}>
							<TableCell>{course.title}</TableCell>
							<TableCell>
								{course.excerpt?.substring(0, 50) + "..."}
							</TableCell>
							<TableCell>
								{course.isPublished ? "Yes ✅" : "No ❌"}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem asChild>
											<Link
												href={`/admin/courses/${course.id}/edit`}
												className="cursor-pointer"
											>
												Edit
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600 cursor-pointer"
											onClick={() =>
												setCourseToDelete(course)
											}
										>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
