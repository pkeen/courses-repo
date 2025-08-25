import { z } from "zod";
import { contentType } from "./contentItem";

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
 * FLAT TYPES EXPERIMENT
 * We may not need the flat types and just use the nested type as its most convenient to the entities/application layer
 */

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
		movedParentId: z.string().optional().nullable(), // Only newly moved clientParentIds
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
