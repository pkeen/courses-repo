import { z } from "zod";

export const contentType = z.enum([
	"lesson",
	"quiz",
	"file",
	"module",
	"video",
]);
export type ContentType = z.infer<typeof contentType>;

/*
 ****************** Course ******************
 */

export const courseNodeDTO = z.object({
	id: z.number(),
	courseId: z.number(),
	parentId: z.number().optional().nullable(),
	order: z.number(),
	contentId: z.number(),
});
export type CourseNodeDTO = z.infer<typeof courseNodeDTO>;
export const createCourseNodeDTO = courseNodeDTO.omit({ id: true });
export type CreateCourseNodeDTO = z.infer<typeof createCourseNodeDTO>;

export const courseDTO = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	excerpt: z.string(),
	isPublished: z.boolean().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});
export type CourseDTO = z.infer<typeof courseDTO>;
export const createCourseDTO = courseDTO.omit({ id: true });
export type CreateCourseDTO = z.infer<typeof createCourseDTO>;

/*
 * ************* Course Tree *************
 */

export type CourseTreeItem = {
	id: number;
	type: ContentType;
	title: string;
	order: number;
	contentId: number;
	isPublished?: boolean;
	clientId: string;
	collapsed?: boolean;
	parentId?: number | null;
	children: CourseTreeItem[]; // allow undefined
};

// 2. Input version allows children to be undefined
type CourseTreeItemInput = Omit<CourseTreeItem, "children"> & {
	children?: CourseTreeItemInput[];
};

// 3. Use z.ZodType<Output, Def, Input> to reconcile
export const courseTreeItem: z.ZodType<
	CourseTreeItem,
	z.ZodTypeDef,
	CourseTreeItemInput
> = z.lazy(() =>
	z.object({
		id: z.number(),
		type: contentType,
		title: z.string(),
		order: z.number(),
		contentId: z.number(),
		isPublished: z.boolean().optional(),
		clientId: z.string(),
		collapsed: z.boolean().optional(),
		parentId: z.number().nullable(),
		children: z.array(courseTreeItem).default([]), // optional in input, always defined in output
	})
);
export const courseTreeDTO = courseDTO.extend({
	items: z.array(courseTreeItem).default([]),
});
export type CourseTreeDTO = z.infer<typeof courseTreeDTO>;

export type CourseTreeItemUpsertInput = {
	id?: number;
	order: number;
	contentId: number;
	isPublished?: boolean;
	parentId: number | null;
	children?: CourseTreeItemUpsertInput[];
	collapsed?: boolean; //
	clientId?: string; //
	title?: string; // none of these are relevant as not changed in db
	type?: ContentType; //
};

export type CourseTreeItemUpsert = {
	id?: number;
	order: number;
	contentId: number;
	parentId: number | null;
	children: CourseTreeItemUpsert[];
	type?: ContentType;
	title?: string;
	isPublished?: boolean;
	clientId?: string;
	collapsed?: boolean;
};

export const courseTreeItemUpsert: z.ZodType<
	CourseTreeItemUpsert,
	z.ZodTypeDef,
	CourseTreeItemUpsertInput
> = z.lazy(() =>
	z.object({
		id: z.number().optional(),
		type: contentType,
		title: z.string(),
		order: z.number(),
		contentId: z.number(),
		isPublished: z.boolean().optional(),
		clientId: z.string(),
		collapsed: z.boolean().optional(),
		parentId: z.number().nullable(),
		children: z.array(courseTreeItemUpsert).default([]),
	})
);
export type CourseTreeItemUpsertDTO = z.infer<typeof courseTreeItemUpsert>;

export const editCourseTreeDTO = courseTreeDTO.extend({
	items: z.array(courseTreeItemUpsert).default([]),
});
export type EditCourseTreeDTO = z.infer<typeof editCourseTreeDTO>;

export const createCourseTreeDTO = editCourseTreeDTO.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export type CreateCourseTreeDTO = z.infer<typeof createCourseTreeDTO>;

/*
 * ************* Content Item *************
 */

export const contentItemDTO = z.object({
	id: z.number(),
	type: contentType,
	title: z.string(),
	isPublished: z.boolean().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});
export type ContentItemDTO = z.infer<typeof contentItemDTO>;
// export const createContentItemDTO = contentItemDTO.omit({ id: true });
// export type CreateContentItemDTO = z.infer<typeof createContentItemDTO>;
// export const editContentItemDTO = contentItemDTO;
// export type EditContentItemDTO = z.infer<typeof editContentItemDTO>;

export const lessonDetail = z.object({
	id: z.number(),
	contentId: z.number(),
	// title: z.string(),
	videoContentId: z.number().optional().nullable(),
	excerpt: z.string(), // short summary for previews
	bodyContent: z.string(), // raw markdown or HTML
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
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
	mimeType: z.string(), // e.g., "application/pdf"
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

/*
 * FLAT TYPES EXPERIMENT
 */

// Something like
type CreateCourseNodeInput = {
	clientId: string; // Temporary local ID (e.g., "a", "b", "a-1")
	clientParentId: string | null; // Matches another clientId or null
	order: number;
	contentId: number;
	parentId: number | null;
};

type CreateCourseTreeDTOFlat = {
	title: string;
	userId: string;
	excerpt: string;
	isPublished: boolean;
	items: CreateCourseNodeInput[];
};

export const courseNodeUpsert = z.object({
	id: z.number().optional(),
	courseId: z.number(),
	parentId: z.number().optional().nullable(),
	clientId: z.string(),
	clientParentId: z.string().optional(), // For new items with a new parent
	order: z.number(),
	contentId: z.number(),
});
export type CourseNodeUpsert = z.infer<typeof courseNodeUpsert>;

export const createCourseFlatNodesInput = z.object({
	userId: z.string(),
	title: z.string(),
	excerpt: z.string(),
	isPublished: z.boolean().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	nodes: z.array(courseNodeUpsert).default([]),
});

export type CreateCourseFlatNodesInput = z.infer<
	typeof createCourseFlatNodesInput
>;

export const editCourseFlatNodesInput = createCourseFlatNodesInput.extend({
	id: z.number(),
});
export type EditCourseFlatNodesInput = z.infer<typeof editCourseFlatNodesInput>;

// courseNode expanded for GET
export const courseNodeDisplay = courseNodeDTO.extend({
	clientId: z.string(),
	type: contentType,
	title: z.string(),
    // children and collapsed are only added by frontend
});
