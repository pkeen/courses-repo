import { z } from "zod";

export const contentType = z.enum([
	"lesson",
	"quiz",
	"file",
	"module",
	"video",
]);
export type ContentType = z.infer<typeof contentType>;
export const contentTypeLabels: Record<ContentType, string> = {
	lesson: "Lesson",
	module: "Module",
	video: "Video",
	file: "File",
	quiz: "Quiz",
};

export const contentItemDTO = z.object({
	id: z.number(),
	type: contentType,
	title: z.string(),
	isPublished: z.boolean().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});
export type ContentItemDTO = z.infer<typeof contentItemDTO>;

export const lessonDetail = z.object({
	id: z.number(),
	contentId: z.number(),
	// title: z.string(),
	videoContentId: z.number().optional().nullable(),
	excerpt: z.string(), // short summary for previews
	bodyContent: z.string(), // raw markdown or HTML
});
export type LessonDetail = z.infer<typeof lessonDetail>;
const createLessonDetail = lessonDetail.omit({ id: true, contentId: true });
export type CreateLessonDetail = z.infer<typeof createLessonDetail>;

export const videoProviderSchema = z.enum([
	"r2",
	"youtube",
	"vimeo",
	"mux",
	"bunny",
]);
export type VideoProvider = z.infer<typeof videoProviderSchema>;
export const videoProviderLabels: Record<VideoProvider, string> = {
	r2: "R2",
	youtube: "YouTube",
	vimeo: "Vimeo",
	mux: "Mux",
	bunny: "Bunny",
};

export const videoDetailDTO = z.object({
	id: z.number(),
	contentId: z.number(),
	provider: videoProviderSchema,
	url: z.string(),
	thumbnailUrl: z.string(),
});
export type VideoDetailDTO = z.infer<typeof videoDetailDTO>;
export const createVideoDetail = videoDetailDTO.omit({
	id: true,
	contentId: true,
});
export type CreateVideoDetail = z.infer<typeof createLessonDetail>;

export const fileDetailDTO = z.object({
	id: z.number(),
	contentId: z.number(),
	fileName: z.string(),
	fileUrl: z.string(),
	mimeType: z.string(), // e.g., "application/pdf" // this should probably be a type?
	size: z.number(),
});
export type FileDetailDTO = z.infer<typeof fileDetailDTO>;
export const createFileDetail = fileDetailDTO.omit({
	id: true,
	contentId: true,
});

// Lesson Combo
export const lessonContentItem = contentItemDTO.extend({
	type: z.literal("lesson"),
	details: lessonDetail,
});
export type LessonContentItem = z.infer<typeof lessonContentItem>;

export const quizContentItem = contentItemDTO.extend({
	type: z.literal("quiz"),
	details: z.any(), // TODO
});
export type QuizContentItem = z.infer<typeof quizContentItem>;

export const moduleContentItem = contentItemDTO.extend({
	type: z.literal("module"),
	details: z.any(), // TODO
});
export type ModuleContentItem = z.infer<typeof moduleContentItem>;

export const fileContentItem = contentItemDTO.extend({
	type: z.literal("file"),
	details: fileDetailDTO,
});
export type FileContentItem = z.infer<typeof fileContentItem>;

export const videoContentItem = contentItemDTO.extend({
	type: z.literal("video"),
	details: videoDetailDTO,
});
export type VideoContentItem = z.infer<typeof videoContentItem>;

export const fullContentItem = z.discriminatedUnion("type", [
	lessonContentItem,
	quizContentItem,
	fileContentItem,
	moduleContentItem,
	videoContentItem,
]);
export type FullContentItem = z.infer<typeof fullContentItem>;
export const editFullContentItem = fullContentItem;
export type EditFullContentItem = z.infer<typeof editFullContentItem>;

const createVideoContentItem = contentItemDTO
	.extend({
		type: z.literal("video"),
		details: createVideoDetail,
	})
	.omit({ id: true });

const createFileContentItem = contentItemDTO
	.extend({
		type: z.literal("file"),
		details: createFileDetail,
	})
	.omit({ id: true });

const createLessonContentItem = contentItemDTO
	.extend({
		type: z.literal("lesson"),
		details: createLessonDetail,
	})
	.omit({ id: true });

const createQuizContentItem = contentItemDTO
	.extend({
		type: z.literal("quiz"),
		details: z.any(), // Update when quizDetail schema is defined
	})
	.omit({ id: true });

const createModuleContentItem = contentItemDTO
	.extend({
		type: z.literal("module"),
		details: z.any(), // Update when moduleDetail schema is defined
	})
	.omit({ id: true });

export const createFullContentItem = z.discriminatedUnion("type", [
	createLessonContentItem,
	createQuizContentItem,
	createFileContentItem,
	createModuleContentItem,
	createVideoContentItem,
]);
export type CreateFullContentItem = z.infer<typeof createFullContentItem>;
