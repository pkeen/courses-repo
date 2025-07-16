import {
	fileContentItem,
	FileContentItem,
} from "@pete_keen/courses-core/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Button } from "../../../ui/button";
import { CardHeader, CardTitle } from "../../../ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDeleteContentDialog } from "../ConfirmDeleteContentDialog";

type Props = {
	fileContent: FileContentItem;
	updateFile: (data: FileContentItem) => Promise<void>;
	deleteFile: (id: number) => Promise<void>;
};

export const FileEdit = ({ fileContent, updateFile, deleteFile }: Props) => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(fileContentItem),
		defaultValues: fileContent,
	});

	const onSubmit = async (values: z.infer<typeof fileContentItem>) => {
		try {
			await updateFile(values);
			toast.success("File updated!");
			form.reset(values);
			// router.refresh(); // reload data if you're on the same page
		} catch (err) {
			toast.error("Something went wrong updating the file.");
			console.error(err);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteFile(fileContent.id);
			toast.success("File deleted!");
			router.push("/admin/content");
		} catch (err) {
			toast.error("Something went wrong deleting the file.");
			console.error(err);
		}
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">Edit File</CardTitle>
				</CardHeader>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.fileName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>File Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.fileUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>File URL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.mimeType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>MIME Type</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="mt-4 cursor-pointer"
					disabled={
						!form.formState.isDirty || form.formState.isSubmitting
					}
				>
					Save Lesson
				</Button>
				<Button
					type="button"
					variant="outline"
					className="ml-2 mt-4 cursor-pointer"
					onClick={() => {
						router.back();
					}}
				>
					Cancel
				</Button>
				<Button
					type="button"
					variant="destructive"
					className="ml-2 mt-4 cursor-pointer"
					onClick={() => {
						setOpenDeleteDialog(true);
					}}
				>
					Delete
				</Button>
				<ConfirmDeleteContentDialog
					open={openDeleteDialog}
					setOpen={setOpenDeleteDialog}
					onConfirm={() => {
						handleDelete();
					}}
				/>
			</form>
		</Form>
	);
};
