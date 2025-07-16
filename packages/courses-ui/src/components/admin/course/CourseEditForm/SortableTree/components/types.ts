import type { RefObject } from "react";

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

/// New Types
export type CourseTreeItem = {
	id: number;
	type: "module" | "lesson" | "quiz" | "file";
	title: string;
	order: number;
	contentId: number;
	isPublished?: boolean;
	clientId: string;
	collapsed?: boolean;
	parentId: number | null;
	children: CourseTreeItem[]; // allow undefined
};

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
