"use client";
import {
	ContentType,
	CreateFullContentItem,
	FullContentItem,
	VideoContentItem,
} from "@pete_keen/courses-core/validators";
// import { LessonEdit } from "../lesson/LessonEdit";
// import { ModuleEdit } from "../module/ModuleEditForm";
// import { VideoEdit } from "../video/VideoEdit";
// import { FileEdit } from "../file/FileEdit";
import { useState } from "react";
import { ContentTypeComboBox } from "../ContentTypeComboBox";
import { useFormContext } from "react-hook-form";

interface BaseFormProps {
	createContent: (input: CreateFullContentItem) => Promise<void>;
}

const LessonNewForm = ({ createContent }: BaseFormProps) => {
	return <div>Lesson Form</div>;
};
const formComponentMap: Record<ContentType, React.FC<BaseFormProps>> = {
	lesson: LessonNewForm,
	// quiz: QuizForm,
	// module: ModuleForm,
};

export const BaseContentFields = () => {
	// const { register } = useFormContext();

	return (
		<div>
			<label>
				Title
				{/* <input {...register("title")} /> */}
			</label>
			{/* More shared fields... */}
		</div>
	);
};

export const ContentNewForm = ({ createContent }: BaseFormProps) => {
	const [type, setType] = useState<ContentType>("lesson");

	const SpecificForm = formComponentMap[type];
	return (
		<div className="space-y-4">
			<ContentTypeComboBox value={type} setValue={setType} />

			{/* Shared Fields */}
			<BaseContentFields />

			{/* Type-Specific Form */}
			{SpecificForm && (
				<SpecificForm
					createContent={async () =>
						Promise.resolve(console.log("ok"))
					}
				/>
			)}
		</div>
	);

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
};
