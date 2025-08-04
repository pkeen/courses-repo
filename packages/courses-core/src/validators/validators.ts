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
	parentId: z.number().nullable(),
	order: z.number(),
	contentId: z.number(),
});
export type CourseNodeDTO = z.infer<typeof courseNodeDTO>;
export const courseNodeCreateDTO = courseNodeDTO.omit({ id: true });
export type CourseNodeCreateDTO = z.infer<typeof courseNodeCreateDTO>;

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
// export type CourseTreeItem = z.infer<typeof courseTreeItem>

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

// export const courseNodeUpsert = z.object({
// 	id: z.number().optional(),
// 	parentId: z.number().optional().nullable(),
// 	clientId: z.string(),
// 	clientParentId: z.string().optional(), // For new items with a new parent
// 	order: z.number(),
// 	contentId: z.number(),
// });
// export type CourseNodeUpsert = z.infer<typeof courseNodeUpsert>;

// export const createCourseFlatNodesInput = z.object({
// 	userId: z.string(),
// 	title: z.string(),
// 	excerpt: z.string(),
// 	isPublished: z.boolean().optional(),
// 	createdAt: z.date().optional(),
// 	updatedAt: z.date().optional(),
// 	nodes: z.array(courseNodeUpsert).default([]),
// });

// export type CreateCourseFlatNodesInput = z.infer<
// 	typeof createCourseFlatNodesInput
// >;

// export const editCourseFlatNodesInput = createCourseFlatNodesInput.extend({
// 	id: z.number(),
// });
// export type EditCourseFlatNodesInput = z.infer<typeof editCourseFlatNodesInput>;

// courseNode expanded for GET
export const courseNodeDisplay = courseNodeDTO
	.extend({
		clientId: z.string(),
		type: contentType,
		title: z.string(),
		isPublished: z.boolean().optional(),
		// children and collapsed are only added by frontend
	})
	.omit({ courseId: true });
export type CourseNodeDisplay = z.infer<typeof courseNodeDisplay>;
export type BackendNode = CourseNodeDisplay;

export const getCourseFlatOutput = courseDTO.extend({
	nodes: z.array(courseNodeDisplay).default([]),
});
export type GetCourseFlatOutput = z.infer<typeof getCourseFlatOutput>;

/*
 * Union Flat and Nested Course / CourseNode Types
 */

export const getBaseNode = courseNodeDTO
	.extend({
		clientId: z.string(),
		type: contentType,
		title: z.string(),
		isPublished: z.boolean().optional(),
	})
	.omit({ courseId: true });
export type BaseNode = z.infer<typeof getBaseNode>;

export const flatNode = getBaseNode.extend({
	children: z.never(),
});
export type FlatNode = z.infer<typeof flatNode>;

export type NestedNode = BaseNode & {
	children: NestedNode[];
};

export const nestedNode: z.ZodType<NestedNode, z.ZodTypeDef, NestedNode> =
	z.lazy(() =>
		getBaseNode.extend({
			children: z.array(nestedNode),
		})
	);

export const courseFlatResponse = courseDTO.extend({
	structure: z.literal("flat"),
	nodes: z.array(flatNode),
});
export type CourseGetFlat = z.infer<typeof courseFlatResponse>;

export const courseGetNested = courseDTO.extend({
	structure: z.literal("nested"),
	nodes: z.array(nestedNode),
});
export type CourseGetNested = z.infer<typeof courseGetNested>;

export const courseGetResponse = z.discriminatedUnion("structure", [
	courseFlatResponse,
	courseGetNested,
]);
export type GetCourseResponse = z.infer<typeof courseGetResponse>;

/*
 * Create Course Nodes
 */

export const createBaseNode = courseNodeCreateDTO
	.extend({
		clientId: z.string(),
		clientParentId: z.string().optional(),
		type: contentType.optional(),
		title: z.string().optional(),
		isPublished: z.boolean().optional(),
	})
	.omit({ courseId: true });
export type CreateBaseNode = z.infer<typeof createBaseNode>;

export const createFlatNode = createBaseNode.extend({
	children: z.never().optional(),
});
export type CreateFlatNode = z.infer<typeof flatNode>;

type CreateNestedNode = CreateBaseNode & {
	children: CreateNestedNode[];
};

export const createNestedNode: z.ZodType<
	CreateNestedNode,
	z.ZodTypeDef,
	CreateNestedNode
> = z.lazy(() =>
	createBaseNode.extend({
		children: z.array(createNestedNode),
	})
);

export const courseCreateInputFlat = createCourseDTO.extend({
	structure: z.literal("flat"),
	nodes: z.array(createFlatNode),
});
export type CourseCreateInputFlat = z.infer<typeof courseCreateInputFlat>;

export const courseCreateInputNested = createCourseDTO.extend({
	structure: z.literal("nested"),
	nodes: z.array(createNestedNode),
});
export type CourseCreateNestedInput = z.infer<typeof courseCreateInputNested>;

export const courseCreateUnionInput = z.discriminatedUnion("structure", [
	courseCreateInputFlat,
	courseCreateInputNested,
]);
export type CourseCreateUnionInput = z.infer<typeof courseCreateUnionInput>;

/*
 * Edit Course Nodes
 */

export const upsertBaseNode = courseNodeCreateDTO
	.extend({
		clientId: z.string(),
		clientParentId: z.string().optional().nullable(),
		type: contentType.optional(),
		isPublished: z.boolean().optional(),
		title: z.string().optional(),
		id: z.number().optional(),
	})
	.omit({ courseId: true });
export type UpsertBaseNode = z.infer<typeof upsertBaseNode>;

export const upsertFlatNode = upsertBaseNode.extend({
	children: z.never().optional(),
});
export type UpsertFlatNode = z.infer<typeof upsertFlatNode>;

export type UpsertNestedNode = UpsertBaseNode & {
	children: UpsertNestedNode[];
};

export const upsertNestedNode: z.ZodType<
	UpsertNestedNode,
	z.ZodTypeDef,
	UpsertNestedNode
> = z.lazy(() =>
	upsertBaseNode.extend({
		children: z.array(upsertNestedNode),
	})
);

export const courseUpdateInputFlat = courseDTO.extend({
	structure: z.literal("flat"),
	nodes: z.array(upsertFlatNode),
});
export type CourseUpdateInputFlat = z.infer<typeof courseUpdateInputFlat>;

// export const courseUpdateInputFlatBase = courseUpdateInputFlat.omit({
// 	structure: true,
// });
// export type CourseUpdateInputFlatBase

export const courseUpdateInputNested = courseDTO.extend({
	structure: z.literal("nested"),
	nodes: z.array(upsertNestedNode),
});
export type CourseUpdateNestedInput = z.infer<typeof courseUpdateInputNested>;

export const courseUpdateUnionInput = z.discriminatedUnion("structure", [
	courseUpdateInputNested,
	courseUpdateInputFlat,
]);
export type CourseUpdateUnionInput = z.infer<typeof courseUpdateUnionInput>;
