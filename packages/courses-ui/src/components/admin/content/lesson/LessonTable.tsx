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
import { ConfirmDeleteContentDialog } from "../ConfirmDeleteContentDialog";
// import { deleteCourse } from "@/lib/actions/course/deleteCourse";
import { toast } from "sonner";
import { ContentItemDTO } from "@pete_keen/courses-core/validators";

export function LessonTable({
	lessons,
	handleDelete,
}: {
	lessons: ContentItemDTO[];
	handleDelete: (id: number) => Promise<void>;
}) {
	const [allContent, setAllContent] = useState(lessons);
	const [search, setSearch] = useState("");
	const [contentToDelete, setContentToDelete] =
		useState<ContentItemDTO | null>(null);

	// console.log("courseToDelete", courseToDelete);

	const filteredContent = allContent.filter((lesson) =>
		lesson.title.toLowerCase().includes(search.toLowerCase())
	);

	const handleDeleteContent = async (lessonId: number) => {
		try {
			await handleDelete(lessonId);
			setAllContent((prev) => prev.filter((c) => c.id !== lessonId));
			setContentToDelete(null);
			toast.success("Lesson deleted!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong deleting the lesson.");
		}
	};
	return (
		<div className="space-y-4">
			<ConfirmDeleteContentDialog
				onConfirm={() => handleDeleteContent(contentToDelete!.id)}
				open={!!contentToDelete}
				setOpen={(open) => {
					if (!open) setContentToDelete(null);
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
						{/* <TableHead className="text-left">Type</TableHead> */}
						<TableHead className="text-left">Published</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredContent.map((lesson) => (
						<TableRow key={lesson.id}>
							<TableCell>{lesson.title}</TableCell>
							{/* <TableCell>{lesson.type}</TableCell> */}
							<TableCell>
								{lesson.isPublished ? "Yes ✅" : "No ❌"}
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
												href={`/admin/courses/content/${lesson.id}/edit`}
												className="cursor-pointer"
											>
												Edit
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600 cursor-pointer"
											onClick={() =>
												setContentToDelete(lesson)
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
