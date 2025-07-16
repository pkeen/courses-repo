"use client";

import { Controller, useForm } from "react-hook-form";
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
import {
	VideoContentItem,
	videoContentItem,
} from "@pete_keen/courses-core/validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ProviderComboBox } from "./ProviderComboBox";

// import LessonEditor from "./LessonContentEditor";
// import { VideoComboBox } from "./VideoComboBox";
import { ConfirmDeleteContentDialog } from "../ConfirmDeleteContentDialog";

type Props = {
	video: VideoContentItem;
	updateVideo: (data: VideoContentItem) => Promise<void>;
	deleteContent: (id: number) => Promise<void>;
	// videos: VideoContentItem[];
};

export const VideoEdit = ({ video, updateVideo, deleteContent }: Props) => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof videoContentItem>>({
		resolver: zodResolver(videoContentItem),
		defaultValues: {
			id: video.id,
			title: video.title,
			isPublished: video.isPublished ?? false,
			type: "video",
			details: {
				id: video.details.id,
				contentId: video.id,
				url: video.details.url,
				provider: video.details.provider,
				thumbnailUrl: video.details.thumbnailUrl,
			},
		},
	});

	const onSubmit = async (values: z.infer<typeof videoContentItem>) => {
		try {
			await updateVideo(values);
			toast.success("Video updated!");
			form.reset(values);
			router.refresh(); // reload data if you're on the same page
		} catch (err) {
			toast.error("Something went wrong updating the video.");
			console.error(err);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteContent(video.id);
			toast.success("Video deleted!");
			router.push("/admin/content");
		} catch (err) {
			toast.error("Something went wrong deleting the video.");
			console.error(err);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium">Edit Video</CardTitle>
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
					name="details.provider"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Provider</FormLabel>
							<FormControl>
								<ProviderComboBox
									value={field.value ?? null}
									setValue={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="details.thumbnailUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thumbnail URL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name="details.bodyContent"
					render={() => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Controller
									control={form.control}
									name="details.bodyContent"
									render={({ field }) => (
										<LessonEditor
											value={field.value ?? ""}
											onChange={field.onChange}
										/>
									)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}
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
