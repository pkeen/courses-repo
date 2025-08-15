"use client";
import {
	ContentType,
	CreateFullContentItem,
	FullContentItem,
	VideoContentItem,
} from "@pete_keen/courses-core/validators";
import { useState } from "react";
import { ContentTypeComboBox } from "../ContentTypeComboBox";
import { Controller, useFormContext } from "react-hook-form";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import {
	Button,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "components/ui";
import { LessonFields } from "../lesson/LessonFields";
import { VideoFields } from "../video/VideoFields";

interface BaseFormProps {
	createContent: (input: CreateFullContentItem) => Promise<void>;
}

const defaultBase = {
	title: "",
	isPublished: false,
};
const defaultsByType: Record<ContentType, CreateFullContentItem> = {
	lesson: {
		...defaultBase,
		type: "lesson",
		details: { videoContentId: "", excerpt: "", bodyContent: "" },
	},
	video: {
		...defaultBase,
		type: "video",
		details: { provider: "youtube", url: "", thumbnailUrl: "string" },
	},
	file: {
		...defaultBase,
		type: "file",
		details: {
			fileName: "",
			fileUrl: "",
			mimeType: "",
			size: 0,
		},
	},
	module: { ...defaultBase, type: "module", details: {} },
	quiz: { ...defaultBase, type: "quiz", details: {} },
	// module: { type: "module", title: "", description: "", lessonIds: [] },
};

// const formComponentMap: Record<ContentType, React.FC<BaseFormProps>> = {
// 	lesson: LessonNewForm,
// 	// quiz: QuizForm,
// 	// module: ModuleForm,
// };

export const BaseContentFields = () => {
	const { control } = useFormContext<CreateFullContentItem>();

	return (
		<div>
			{/* Course Title */}
			<FormField
				control={control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Title</FormLabel>
						<FormControl>
							<Input placeholder="Enter title" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{/* More shared fields... */}
		</div>
	);
};

export const ContentNewForm = ({ createContent }: BaseFormProps) => {
	const methods = useForm<CreateFullContentItem>({
		defaultValues: defaultsByType.lesson,
		shouldUnregister: true,
		// resolver: zodResolver(ContentSchema) // optional, see note below
	});

	const { handleSubmit, reset, setValue, control, formState } = methods;
	const type = useWatch({ control, name: "type" });
	// const [type, setType] = useState<ContentType>("lesson");
	const onTypeChange = (t: ContentType) => {
		// Set the discriminant AND reset to that type's shape/defaults
		setValue("type", t, { shouldDirty: true });
		reset(defaultsByType[t]); // or reset(defaultsByType[t], { keepDirtyValues: true })
	};

	const onSubmit = handleSubmit(async (data) => {
		await createContent(data);
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={onSubmit} className="space-y-6">
				<Controller
					control={control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								<ContentTypeComboBox
									value={field.value}
									setValue={field.onChange} // calls RHF onChange
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* shared fields used by all types */}
				<BaseContentFields />

				{/* type-specific sections use the same form via context */}
				{type === "lesson" && <LessonFields />}
				{type === "video" && <VideoFields />}
				{type === "file" && <FileFields />}

				<div className="flex gap-3">
					<Button type="submit" disabled={!formState.isDirty}>
						Create
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};

// const SpecificForm = formComponentMap[type];
// return (
// 	<div className="space-y-4">
// 		<ContentTypeComboBox value={type} setValue={setType} />

// 		{/* Shared Fields */}
// 		<BaseContentFields />

// 		{/* Type-Specific Form */}
// 		{SpecificForm && (
// 			<SpecificForm
// 				createContent={async () =>
// 					Promise.resolve(console.log("ok"))
// 				}
// 			/>
// 		)}
// 	</div>
// );

// switch (contentItem.type) {
// 	case "lesson": {
// 		return (
// 			<LessonEdit
// 				lesson={contentItem}
// 				videos={videos}
// 				updateLesson={updateContent}
// 				deleteContent={deleteContent}
// 			/>
// 		);
// 	}
// 	case "module": {
// 		return (
// 			<ModuleEdit
// 				moduleContent={contentItem}
// 				updateModule={updateContent}
// 				deleteContent={deleteContent}
// 			/>
// 		);
// 	}
// 	case "file": {
// 		return (
// 			<FileEdit
// 				fileContent={contentItem}
// 				updateFile={updateContent}
// 				deleteFile={deleteContent}
// 			/>
// 		);
// 	}
// 	case "quiz": {
// 		return <div>Quiz - Not supported yet</div>;
// 	}
// 	case "video": {
// 		return (
// 			<VideoEdit
// 				video={contentItem}
// 				updateVideo={updateContent}
// 				deleteContent={deleteContent}
// 			/>
// 		);
// 	}
// 	default: {
// 		return <div>Unknown content type</div>;
// 	}
// }
// };
