"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Switch } from "../../../ui/switch";
import { Button } from "../../../ui/button";
import { Card, CardHeader } from "../../../ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteCourseDialog } from "../ConfirmDeleteCourseDialog";
import { SortableTree } from "./SortableTree";
import { Controller } from "react-hook-form";
import { AddContentDialog } from "./AddContentDialog";
import { SelectExistingContentDialog } from "./SelectExistingContentDialog";
import {
	ContentItemDTO,
	EditCourseTreeDTO,
	editCourseTreeDTO,
	CourseTreeItemUpsert,
} from "@pete_keen/courses-core/validators";
import { Textarea } from "components/ui/textarea";
// import { courseDisplayToUi } from "./course-display-to-ui";

export function CourseEditForm({
	course,
	existingContent,
	onSubmit,
	onDelete,
}: {
	course: EditCourseTreeDTO;
	existingContent: ContentItemDTO[];
	onSubmit: (values: EditCourseTreeDTO) => Promise<EditCourseTreeDTO>;
	onDelete: (id: number) => Promise<void>;
	// fetchModuleTree: (moduleId: number) => Promise<ModuleTreeDTO | null>;
}) {
	const form = useForm({
		resolver: zodResolver(editCourseTreeDTO),
		defaultValues: course,
	});
	// 🟣 1. Build a *stable* clientId without randomness
	// const defaultValues = useMemo(() => courseDisplayToUi(course), [course]);
	// console.log("Form values:", form.getValues());

	// const [selectLessonOpen, setSelectLessonOpen] = useState(false);
	// const [selectModuleOpen, setSelectModuleOpen] = useState(false);
	const [selectContentOpen, setSelectContentOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const { fields, append, move } = useFieldArray({
		control: form.control,
		name: "items",
		keyName: "fieldId", // anything except “id”
	});

	const handleSubmit = (values: EditCourseTreeDTO) => {
		console.log(values);
		startTransition(async () => {
			try {
				const course = await onSubmit(values);
				toast.success("Course updated!");
				form.reset(course);
				// router.refresh(); // reload data if you're on the same page
			} catch (err) {
				toast.error("Something went wrong updating the course.");
				console.error(err);
			}
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			try {
				await onDelete(course.id);
				toast.success("Course deleted!");
				router.push("/admin/courses");
			} catch (err) {
				toast.error("Something went wrong deleting the course.");
				console.error(err);
			}
		});
	};

	return (
		<div>
			<Form {...form}>
				<form
					// onSubmit={form.handleSubmit(onSubmit)}
					onSubmit={form.handleSubmit(handleSubmit, (errors) =>
						console.log("❌ validation errors", errors)
					)}
					className="space-y-8"
				>
					<Card className="p-6 space-y-4">
						<CardHeader>Course Information</CardHeader>
						{/* Course Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter course title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Course Description */}
						<FormField
							control={form.control}
							name="excerpt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Excerpt</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter course excerpt"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Course Publish */}
						<FormField
							control={form.control}
							name="isPublished"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<FormLabel>Publish Course</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</Card>

					{/* Buttons to add top-level Modules or Lessons */}
					<Card className="p-4">
						<CardHeader>Course Content</CardHeader>
						<div className="flex gap-4">
							<AddContentDialog
								trigger={
									<Button type="button" variant="outline">
										+ Add Content
									</Button>
								}
								title="Add Content"
								onSelect={(choice) => {
									if (choice === "new") {
										console.log("new");
									} else {
										setSelectContentOpen(true);
									}
								}}
							/>
							<SelectExistingContentDialog
								title="Select Existing Content"
								open={selectContentOpen}
								onOpenChange={setSelectContentOpen}
								items={existingContent}
								onSelect={async (item) => {
									const courseTreeItem: CourseTreeItemUpsert =
										{
											id: undefined,
											clientId: `new-${fields.length}`,
											contentId: item.id,
											order: fields.length,
											parentId: null,
											title: item.title,
											isPublished:
												item.isPublished ?? false,
											type: item.type,
											children: [],
										};

									append(courseTreeItem);

									setSelectContentOpen(false); // Close after selecting
								}}
							/>
						</div>
						<Controller
							control={form.control}
							name="items"
							render={({ field }) => (
								<SortableTree
									items={field.value ?? []}
									onChange={field.onChange}
									indicator={true}
									removable={true}
									collapsible={true}
									indentationWidth={50}
								/>
							)}
						/>
						{/* <NestedSortableSlotList fields={fields} move={move} /> */}
					</Card>

					<Button
						type="submit"
						disabled={isPending || !form.formState.isDirty}
					>
						Save Course
					</Button>
					<Button
						type="button"
						variant="outline"
						className="ml-2 mt-4 cursor-pointer"
						onClick={() => router.back()}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						className="ml-2 mt-4 cursor-pointer"
						onClick={() => setOpenDeleteDialog(true)}
					>
						Delete Course
					</Button>
					<ConfirmDeleteCourseDialog
						open={openDeleteDialog}
						setOpen={setOpenDeleteDialog}
						onConfirm={handleDelete}
					/>
				</form>
			</Form>
		</div>
	);
}
