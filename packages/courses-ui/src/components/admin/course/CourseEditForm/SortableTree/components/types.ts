import type { RefObject } from "react";
import {
	UpsertNestedNode,
	ContentType,
	upsertBaseNode,
	contentType,
} from "@pete_keen/courses-core/validators";
import z from "zod";

// export interface TreeItem {
// 	id: string;
// 	name: string;
// 	// type: "course" | "module" | "lesson";
// 	children: TreeItem[];
// 	collapsed?: boolean;
// }

// export type TreeItems = TreeItem[];

// export interface FlattenedItem extends TreeItem {
// 	parentId: null | string;
// 	depth: number;
// 	index: number;
// }

// / New Types
export type CourseTreeItem = {
	id?: number;
	type: ContentType;
	title: string;
	order: number;
	contentId: number;
	isPublished?: boolean;
	clientId: string;
	collapsed?: boolean;
	parentId: number | null;
	children: CourseTreeItem[]; // allow undefined
	clientParentId?: string | null; // store it permanently
};

export const courseTreeItem: z.ZodType<
	CourseTreeItem,
	z.ZodTypeDef,
	CourseTreeItem
> = z.lazy(() =>
	upsertBaseNode.extend({
		type: contentType,
		title: z.string(),
		collapsed: z.boolean().optional(),
		children: z.array(courseTreeItem),
		clientParentId: z.string().optional().nullable(),
	})
);

export interface FlattenedCourseTreeItem extends CourseTreeItem {
	// clientId: string;
	clientParentId: string | null;
	depth: number;
	index: number;
}

// export interface CourseLesson extends CourseTreeItem {
// 	type: "lesson";
// 	children: never;
// }

export type SensorContext = RefObject<{
	items: FlattenedCourseTreeItem[];
	offset: number;
}>;
