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
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
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

export const courseTreeItemUpsert: z.ZodType<any> = z.lazy(() =>
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
export type CourseTreeItemUpsert = z.infer<typeof courseTreeItemUpsert>;

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
	videoContentId: z.number(),
	excerpt: z.string(), // short summary for previews
	bodyContent: z.string(), // raw markdown or HTML
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});
export type LessonDetail = z.infer<typeof lessonDetail>;

/*
 * ************* Video *************
 */
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
// export const createLessonDetail = lessonDetail.omit({ id: true });
// export type CreateLessonDetail = z.infer<typeof createLessonDetail>;

export const fileDetailDTO = z.object({
	id: z.number(),
	contentId: z.number(),
	fileName: z.string(),
	fileUrl: z.string(),
	mimeType: z.string(), // e.g., "application/pdf"
	size: z.number().optional(),
});
export type FileDetailDTO = z.infer<typeof fileDetailDTO>;

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
const commonOmissions = { id: true } as const;

const createFullContentItem = z.discriminatedUnion("type", [
	lessonContentItem.omit(commonOmissions),
	quizContentItem.omit(commonOmissions),
	fileContentItem.omit(commonOmissions),
	moduleContentItem.omit(commonOmissions),
	videoContentItem.omit(commonOmissions),
]);

export type CreateFullContentItem = z.infer<typeof createFullContentItem>;

// export const createVideoDetailDTO = videoDetailDTO.omit({ id: true });
// export type CreateVideoDetailDTO = z.infer<typeof createVideoDetailDTO>;
// export const editVideoDetailDTO = videoDetailDTO;
// export type EditVideoDetailDTO = z.infer<typeof editVideoDetailDTO>;

// /*
//  * NEW COURSE TYPES
//  */

// export const moduleSlotDeepDisplay = z.object({
// 	id: z.number(),
// 	lessonId: z.number(),
// 	order: z.number(),
// 	content: z.object({
// 		// id: z.number(),
// 		name: z.string(),
// 		isPublished: z.boolean().optional(),
// 	}),
// });
// export type ModuleSlotDeepDisplay = z.infer<typeof moduleSlotDeepDisplay>;

// export const slotDeepDisplay = z
// 	.object({
// 		id: z.number(),
// 		courseId: z.number(),
// 		moduleId: z.number().nullable(),
// 		lessonId: z.number().nullable(),
// 		order: z.number(),
// 		content: z.union([
// 			z.object({
// 				type: z.literal("lesson"),
// 				id: z.number(),
// 				name: z.string(),
// 				isPublished: z.boolean().optional(),
// 			}),
// 			z.object({
// 				type: z.literal("module"),
// 				id: z.number(),
// 				name: z.string(),
// 				isPublished: z.boolean().optional(),
// 				moduleSlots: z.array(moduleSlotDeepDisplay).default([]),
// 			}),
// 		]),
// 	})
// 	.superRefine((data, ctx) => {
// 		const bothNull = data.moduleId === null && data.lessonId === null;
// 		const bothSet = data.moduleId !== null && data.lessonId !== null;

// 		if (bothNull || bothSet) {
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.custom,
// 				message:
// 					"You must provide either a moduleId or lessonId, but not both or neither.",
// 				path: ["moduleId"],
// 			});
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.custom,
// 				message:
// 					"You must provide either a moduleId or lessonId, but not both or neither.",
// 				path: ["lessonId"],
// 			});
// 		}
// 	});
// export type SlotDeepDisplay = z.infer<typeof slotDeepDisplay>;

// export const courseDeepDisplay = z.object({
// 	id: z.number(),
// 	userId: z.string(),
// 	title: z.string(),
// 	description: z.string(),
// 	isPublished: z.boolean().optional(),
// 	slots: z.array(slotDeepDisplay).default([]),
// });
// export type CourseDeepDisplay = z.infer<typeof courseDeepDisplay>;

// export const uiModuleSlotDeep = moduleSlotDeepDisplay.extend({
// 	clientId: z.string(),
// });
// export type UiModuleSlotDeep = z.infer<typeof uiModuleSlotDeep>;

// export const uiSlotDeep = z
// 	.object({
// 		id: z.number(),
// 		courseId: z.number(),
// 		moduleId: z.number().nullable(),
// 		lessonId: z.number().nullable(),
// 		order: z.number(),
// 		clientId: z.string(),
// 		content: z.union([
// 			z.object({
// 				type: z.literal("lesson"),
// 				id: z.number(),
// 				name: z.string(),
// 				isPublished: z.boolean().optional(),
// 			}),
// 			z.object({
// 				type: z.literal("module"),
// 				id: z.number(),
// 				name: z.string(),
// 				isPublished: z.boolean().optional(),
// 				moduleSlots: z.array(uiModuleSlotDeep).default([]).optional(),
// 			}),
// 		]),
// 	})
// 	.superRefine((data, ctx) => {
// 		if (
// 			(data.moduleId === null && data.lessonId === null) ||
// 			(data.moduleId !== null && data.lessonId !== null)
// 		) {
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.custom,
// 				message:
// 					"You must provide either a moduleId or lessonId, not both or neither.",
// 				path: ["moduleId"],
// 			});
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.custom,
// 				message:
// 					"You must provide either a moduleId or lessonId, not both or neither.",
// 				path: ["lessonId"],
// 			});
// 		}
// 	});

// export type UiSlotDeep = z.infer<typeof uiSlotDeep>;

// export const uiCourseDeep = z.object({
// 	id: z.number(),
// 	userId: z.string(),
// 	title: z.string(),
// 	description: z.string(),
// 	isPublished: z.boolean().optional(),
// 	slots: z.array(uiSlotDeep).default([]).optional(),
// });
// export type UiCourseDeep = z.infer<typeof uiCourseDeep>;

// /*
//  * Data Transfer Objects
//  */

// /*
//  * Basic DTO
//  */
// // Step 1: Create a base object (without refinement)
// const baseCourseSlotDTO = z.object({
// 	id: z.number(),
// 	courseId: z.number(),
// 	moduleId: z.number().nullable(),
// 	lessonId: z.number().nullable(),
// 	order: z.number(),
// 	moduleSlots: z.array(moduleSlotDTO).default([]).optional(),
// });

// export const courseSlotDTO = baseCourseSlotDTO.superRefine((data, ctx) => {
// 	const hasModuleId = data.moduleId !== null;
// 	const hasLessonId = data.lessonId !== null;

// 	if (hasModuleId === hasLessonId) {
// 		ctx.addIssue({
// 			code: z.ZodIssueCode.custom,
// 			message:
// 				"You must provide either a moduleId or lessonId, but not both or neither.",
// 			path: ["moduleId"],
// 		});
// 		ctx.addIssue({
// 			code: z.ZodIssueCode.custom,
// 			message:
// 				"You must provide either a moduleId or lessonId, but not both or neither.",
// 			path: ["lessonId"],
// 		});
// 	}

// 	if (!hasModuleId && data.moduleSlots && data.moduleSlots.length > 0) {
// 		ctx.addIssue({
// 			code: z.ZodIssueCode.custom,
// 			message: "moduleSlots should only be present when moduleId is set.",
// 			path: ["moduleSlots"],
// 		});
// 	}
// });
// export type CourseSlotDTO = z.infer<typeof courseSlotDTO>;

// export const courseDTO = z.object({
// 	id: z.number(),
// 	userId: z.string(),
// 	title: z.string(),
// 	description: z.string(),
// 	isPublished: z.boolean().optional(),
// 	slots: z.array(courseSlotDTO).default([]),
// });
// export type CourseDTO = z.infer<typeof courseDTO>;

// /**
//  * Update DTO
//  */
// export const moduleSlotUpsertDTO = moduleSlotDTO.omit({ id: true });
// export type ModuleSlotUpsertDTO = z.infer<typeof moduleSlotUpsertDTO>;

// export const courseSlotUpsertDTO = baseCourseSlotDTO.extend({
// 	id: baseCourseSlotDTO.shape.id.optional(),
// 	moduleSlots: z.array(moduleSlotUpsertDTO).default([]).optional(),
// });
// export type CourseSlotUpsertDTO = z.infer<typeof courseSlotUpsertDTO>;

// export const editCourseDTO = courseDTO.extend({
// 	id: courseDTO.shape.id, // required
// 	slots: z.array(courseSlotUpsertDTO).optional(),
// });
// export type EditCourseDTO = z.infer<typeof editCourseDTO>;

// export const newCourseDTO = courseDTO.omit({ id: true }).extend({
// 	slots: z.array(courseSlotUpsertDTO).optional(),
// });
// export type NewCourseDTO = z.infer<typeof newCourseDTO>;

// /**
//  * DISPLAY TYPES
//  */

// export const moduleSlotDisplay = moduleSlotDTO.extend({
// 	display: z.object({
// 		name: z.string(),
// 		isPublished: z.boolean().optional(),
// 	}),
// });
// export type ModuleSlotDisplay = z.infer<typeof moduleSlotDisplay>;

// export const courseSlotDisplay = baseCourseSlotDTO.extend({
// 	moduleSlots: z.array(moduleSlotDisplay).default([]).optional(),
// 	display: z.object({
// 		name: z.string(),
// 		isPublished: z.boolean().optional(),
// 	}),
// });
// export type CourseSlotDisplay = z.infer<typeof courseSlotDisplay>;

// export const courseDisplay = courseDTO.extend({
// 	slots: z.array(courseSlotDisplay).default([]),
// });
// export type CourseDisplay = z.infer<typeof courseDisplay>;

// /**
//  * UI TYPES
//  */

// export const uiModuleSlotDisplay = moduleSlotDisplay.extend({
// 	clientId: z.string(),
// 	id: moduleSlotDisplay.shape.id.optional(),
// });
// export type UiModuleSlotDisplay = z.infer<typeof uiModuleSlotDisplay>;

// export const uiCourseSlotDisplay = courseSlotDisplay.extend({
// 	clientId: z.string(),
// 	id: courseSlotDisplay.shape.id.optional(),
// 	moduleSlots: z.array(uiModuleSlotDisplay).default([]).optional(),
// });
// export type UiCourseSlotDisplay = z.infer<typeof uiCourseSlotDisplay>;

// export const uiCourseDisplay = courseDisplay.extend({
// 	slots: z.array(uiCourseSlotDisplay).default([]).optional(),
// });
// export type UiCourseDisplay = z.infer<typeof uiCourseDisplay>;

/**
 * Tree Types
 */

// export const courseTreeItem: z.ZodType<any> = z.lazy(() =>
// 	z.object({
// 		id: z.number(),
// 		type: z.enum(["module", "lesson"]),
// 		name: z.string(),
// 		order: z.number(),
// 		moduleId: z.number().optional(),
// 		lessonId: z.number().optional(),
// 		isPublished: z.boolean().optional(),
// 		clientId: z.string(),
// 		collapsed: z.boolean().optional(),
// 		children: z.array(courseTreeItem).default([]),
// 	})
// );
// export type CourseTreeItem = z.infer<typeof courseTreeItem>;

// // Step 1: Define the TypeScript interface first for clarity
// // 1. Declare the schema (recursive with z.lazy)
// // First, define the type
// export type CourseTreeItem = {
// 	id: number;
// 	type: "module" | "lesson";
// 	name: string;
// 	order: number;
// 	moduleId?: number;
// 	lessonId?: number;
// 	isPublished?: boolean;
// 	clientId: string;
// 	collapsed?: boolean;
// 	children: CourseTreeItem[]; // allow undefined
// };

// // 2. Input version allows children to be undefined
// type CourseTreeItemInput = Omit<CourseTreeItem, "children"> & {
// 	children?: CourseTreeItemInput[];
// };

// // 3. Use z.ZodType<Output, Def, Input> to reconcile
// export const courseTreeItem: z.ZodType<
// 	CourseTreeItem,
// 	z.ZodTypeDef,
// 	CourseTreeItemInput
// > = z.lazy(() =>
// 	z.object({
// 		id: z.number(),
// 		type: z.enum(["module", "lesson"]),
// 		name: z.string(),
// 		order: z.number(),
// 		moduleId: z.number().optional(),
// 		lessonId: z.number().optional(),
// 		isPublished: z.boolean().optional(),
// 		clientId: z.string(),
// 		collapsed: z.boolean().optional(),
// 		children: z.array(courseTreeItem).default([]), // optional in input, always defined in output
// 	})
// );

// export const courseTreeDTO = z.object({
// 	id: z.number(),
// 	userId: z.string(),
// 	title: z.string(),
// 	description: z.string(),
// 	isPublished: z.boolean().optional(),
// 	items: z.array(courseTreeItem).default([]),
// });
// export type CourseTreeDTO = z.infer<typeof courseTreeDTO>;

// // For upsert, redefine with optional `id`
// export const courseTreeItemUpsert: z.ZodType<any> = z.lazy(() =>
// 	z.object({
// 		id: z.number().optional(),
// 		type: z.enum(["module", "lesson"]),
// 		name: z.string(),
// 		order: z.number(),
// 		moduleId: z.number().optional().nullable(),
// 		lessonId: z.number().optional().nullable(),
// 		isPublished: z.boolean().optional(),
// 		clientId: z.string(),
// 		collapsed: z.boolean().optional(),
// 		children: z.array(courseTreeItemUpsert).default([]),
// 	})
// );
// export type CourseTreeItemUpsert = z.infer<typeof courseTreeItemUpsert>;

// export const editCourseTreeDTO = courseTreeDTO.extend({
// 	items: z.array(courseTreeItemUpsert).default([]),
// });
// export type EditCourseTreeDTO = z.infer<typeof editCourseTreeDTO>;

// /*
//  * Module Tree
//  */
// export const moduleTreeDTO = z.object({
// 	id: z.number(),
// 	name: z.string(),
// 	description: z.string().optional().nullable(),
// 	isPublished: z.boolean().optional(),
// 	items: z.array(courseTreeItem).default([]),
// });

// export type ModuleTreeDTO = z.infer<typeof moduleTreeDTO>;
