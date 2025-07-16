"use client";
import {
	FullContentItem,
	VideoContentItem,
} from "@pete_keen/courses-core/validators";
import { LessonEdit } from "../lesson/LessonEdit";
import { ModuleEdit } from "../module/ModuleEditForm";
import { VideoEdit } from "../video/VideoEdit";
import { FileEdit } from "../file/FileEdit";

export const ContentEditForm = ({
	contentItem,
	videos,
	updateContent,
	deleteContent,
}: {
	contentItem: FullContentItem;
	videos: VideoContentItem[];
	updateContent: (data: FullContentItem) => Promise<void>;
	deleteContent: (id: number) => Promise<void>;
}) => {
	switch (contentItem.type) {
		case "lesson": {
			return (
				<LessonEdit
					lesson={contentItem}
					videos={videos}
					updateLesson={updateContent}
					deleteContent={deleteContent}
				/>
			);
		}
		case "module": {
			return (
				<ModuleEdit
					moduleContent={contentItem}
					updateModule={updateContent}
					deleteContent={deleteContent}
				/>
			);
		}
		case "file": {
			return (
				<FileEdit
					fileContent={contentItem}
					updateFile={updateContent}
					deleteFile={deleteContent}
				/>
			);
		}
		case "quiz": {
			return <div>Quiz</div>;
		}
		case "video": {
			return (
				<VideoEdit
					video={contentItem}
					updateVideo={updateContent}
					deleteContent={deleteContent}
				/>
			);
		}
		default: {
			return <div>Unknown content type</div>;
		}
	}
};
