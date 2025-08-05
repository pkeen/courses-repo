"use client";

import { UpsertNestedNode } from "@pete_keen/courses-core/validators";
import { CourseTreeItem, FlattenedCourseTreeItem } from "./components/types";
import { arrayMove } from "@dnd-kit/sortable";

// export function flatten(
// 	items: CourseTreeItem[],
// 	clientParentId: string | null = null,
// 	depth = 0
// ): FlattenedCourseTreeItem[] {
// 	return items.reduce<FlattenedCourseTreeItem[]>((acc, item, index) => {
// 		return [
// 			...acc,
// 			{ ...item, clientParentId, depth, index },
// 			...flatten(item.children, item.clientId, depth + 1),
// 		];
// 	}, []);
// }

export function flatten(
	items: CourseTreeItem[],
	clientParentId: string | null = null,
	depth = 0
): FlattenedCourseTreeItem[] {
	return items.reduce<FlattenedCourseTreeItem[]>((acc, item, index) => {
		const flatItem: FlattenedCourseTreeItem = {
			...item,
			clientParentId,
			depth,
			index,
		};

		// Always flatten children so parentId is preserved
		const childrenFlat = flatten(item.children, item.clientId, depth + 1);

		return [...acc, flatItem, ...childrenFlat];
	}, []);
}

export function flattenTree(
	items: CourseTreeItem[]
): FlattenedCourseTreeItem[] {
	console.log("flattyened tree", flatten(items));
	return flatten(items);
}

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);
// Added isIOS bc was breaking on ssr
export const isIOS = (): boolean =>
	typeof navigator !== "undefined" &&
	/iPad|iPhone|iPod/.test(navigator.platform);

export function removeItem(items: CourseTreeItem[], clientId: string) {
	const newItems: CourseTreeItem[] = [];

	for (const item of items) {
		if (item.clientId === clientId) {
			continue;
		}

		if (item.children.length) {
			item.children = removeItem(item.children, clientId);
		}

		newItems.push(item);
	}

	return newItems;
}

export function findItemDeep(
	items: CourseTreeItem[],
	itemClientId: string
): CourseTreeItem | undefined {
	for (const item of items) {
		const { clientId, children } = item;

		if (clientId === itemClientId) {
			return item;
		}

		if (children.length) {
			const child = findItemDeep(children, itemClientId);

			if (child) {
				return child;
			}
		}
	}

	return undefined;
}

function countChildren(items: CourseTreeItem[], count = 0): number {
	return items.reduce((acc, { children }) => {
		if (children.length) {
			return countChildren(children, acc + 1);
		}

		return acc + 1;
	}, count);
}

export function getChildCount(items: CourseTreeItem[], itemClientId: string) {
	if (!itemClientId) {
		return 0;
	}

	const item = findItemDeep(items, itemClientId);

	return item ? countChildren(item.children) : 0;
}

// export function getProjection(
// 	items: FlattenedCourseTreeItem[],
// 	activeId: string,
// 	overId: string,
// 	dragOffset: number,
// 	indentationWidth: number
// ) {
// 	const overItemIndex = items.findIndex(
// 		({ clientId }) => clientId === overId
// 	);
// 	const activeItemIndex = items.findIndex(
// 		({ clientId }) => clientId === activeId
// 	);
// 	const activeItem = items[activeItemIndex];
// 	const newItems = arrayMove(items, activeItemIndex, overItemIndex);
// 	const previousItem = newItems[overItemIndex - 1];
// 	const nextItem = newItems[overItemIndex + 1];
// 	const dragDepth = getDragDepth(dragOffset, indentationWidth);
// 	const projectedDepth = activeItem.depth + dragDepth;
// 	const maxDepth = getMaxDepth({
// 		activeItem,
// 		previousItem,
// 	});
// 	const minDepth = getMinDepth({ nextItem });
// 	let depth = projectedDepth;

// 	if (projectedDepth >= maxDepth) {
// 		depth = maxDepth;
// 	} else if (projectedDepth < minDepth) {
// 		depth = minDepth;
// 	}

// 	return { depth, maxDepth, minDepth, clientParentId: getParentId() };

// 	function getParentId() {
// 		if (depth === 0 || !previousItem) {
// 			return null;
// 		}

// 		if (depth === previousItem.depth) {
// 			return previousItem.clientParentId;
// 		}

// 		if (depth > previousItem.depth) {
// 			return previousItem.clientId;
// 		}

// 		const newParent = newItems
// 			.slice(0, overItemIndex)
// 			.reverse()
// 			.find((item) => item.depth === depth)?.clientParentId;

// 		return newParent ?? null;
// 	}
// }

// export function getProjection(
// 	items: FlattenedCourseTreeItem[],
// 	activeId: string,
// 	overId: string,
// 	dragOffset: number,
// 	indentationWidth: number,
// 	maxDepth: number = 2 // default = free limit
// ) {
// 	const overItemIndex = items.findIndex(
// 		({ clientId }) => clientId === overId
// 	);
// 	const activeItemIndex = items.findIndex(
// 		({ clientId }) => clientId === activeId
// 	);

// 	const activeItem = items[activeItemIndex];
// 	const newItems = arrayMove(items, activeItemIndex, overItemIndex);

// 	const previousItem = newItems[overItemIndex - 1];
// 	const nextItem = newItems[overItemIndex + 1];

// 	const dragDepth = getDragDepth(dragOffset, indentationWidth);
// 	const projectedDepth = activeItem.depth + dragDepth;

// 	const maxAllowedDepth = getMaxDepth({
// 		activeItem,
// 		previousItem,
// 		maxDepth, // pass in the configurable max depth
// 	});
// 	const minAllowedDepth = getMinDepth({ nextItem });

// 	let depth = projectedDepth;

// 	if (projectedDepth >= maxAllowedDepth) {
// 		depth = maxAllowedDepth;
// 	} else if (projectedDepth < minAllowedDepth) {
// 		depth = minAllowedDepth;
// 	}

// 	return {
// 		depth,
// 		maxDepth: maxAllowedDepth,
// 		minDepth: minAllowedDepth,
// 		clientParentId: getParentId(),
// 	};

// 	function getParentId() {
// 		if (depth === 0 || !previousItem) {
// 			return null;
// 		}

// 		if (depth === previousItem.depth) {
// 			return previousItem.clientParentId;
// 		}

// 		if (depth > previousItem.depth) {
// 			return previousItem.clientId;
// 		}

// 		const newParent = newItems
// 			.slice(0, overItemIndex)
// 			.reverse()
// 			.find((item) => item.depth === depth)?.clientParentId;

// 		return newParent ?? null;
// 	}
// }

export function getDragDepth(offset: number, indentationWidth: number) {
	return Math.round(offset / indentationWidth);
}

// export function getMaxDepth({
// 	activeItem,
// 	previousItem,
// }: {
// 	activeItem: FlattenedCourseTreeItem;
// 	previousItem: FlattenedCourseTreeItem;
// }) {
// 	// May need to add rules in here
// 	if (previousItem) {
// 		if (isModule(activeItem)) {
// 			return previousItem.depth;
// 		}
// 		if (isModule(previousItem) && isLesson(activeItem)) {
// 			return previousItem.depth + 1;
// 		}
// 		if (isLesson(previousItem) && isLesson(activeItem)) {
// 			return previousItem.depth;
// 		}
// 	}

// 	return 0;
// }

// export function getMaxDepth({
// 	activeItem,
// 	previousItem,
// }: {
// 	activeItem: FlattenedCourseTreeItem;
// 	previousItem: FlattenedCourseTreeItem;
// }) {
// 	if (isModule(activeItem)) return 0;
// 	if (previousItem && isModule(previousItem)) return 1;
// 	return 0;
// }

// export function getMaxDepth({
// 	activeItem,
// 	previousItem,
// }: {
// 	activeItem: FlattenedCourseTreeItem;
// 	previousItem: FlattenedCourseTreeItem;
// }) {
// 	const MAX_MODULE_DEPTH = 2;

// 	// if (isModule(activeItem)) {
// 	// 	// Prevent nesting beyond max module depth
// 	// 	const max = previousItem ? previousItem.depth + 1 : 1;
// 	// 	return Math.min(max, MAX_MODULE_DEPTH);
// 	// }

// 	if (previousItem && isModule(previousItem)) {
// 		return previousItem.depth + 1;
// 	}

// 	return 0;
// }

export function getProjection(
	items: FlattenedCourseTreeItem[],
	activeId: string,
	overId: string,
	dragOffset: number,
	indentationWidth: number,
	maxDepth: number = 2 // configurable (premium)
) {
	const overItemIndex = items.findIndex(
		({ clientId }) => clientId === overId
	);
	const activeItemIndex = items.findIndex(
		({ clientId }) => clientId === activeId
	);

	const activeItem = items[activeItemIndex];
	const newItems = arrayMove(items, activeItemIndex, overItemIndex);

	const previousItem = newItems[overItemIndex - 1];
	const nextItem = newItems[overItemIndex + 1];

	const dragDepth = getDragDepth(dragOffset, indentationWidth);
	const projectedDepth = activeItem.depth + dragDepth;

	const maxAllowedDepth = getMaxDepth({
		activeItem,
		previousItem,
		maxDepth,
	});
	const minAllowedDepth = getMinDepth({ nextItem });

	let depth = projectedDepth;

	if (projectedDepth >= maxAllowedDepth) {
		depth = maxAllowedDepth;
	} else if (projectedDepth < minAllowedDepth) {
		depth = minAllowedDepth;
	}

	return {
		depth,
		maxDepth: maxAllowedDepth,
		minDepth: minAllowedDepth,
		clientParentId: getParentId(
			depth,
			previousItem,
			nextItem,
			activeItem,
			newItems,
			overItemIndex
		),
	};
}

function getParentId(
	depth: number,
	previousItem: FlattenedCourseTreeItem | undefined,
	nextItem: FlattenedCourseTreeItem | undefined,
	activeItem: FlattenedCourseTreeItem,
	newItems: FlattenedCourseTreeItem[],
	overItemIndex: number
) {
	// Root-level items have no parent
	if (depth === 0) {
		return null;
	}

	// If depth is same as previous item, keep its parent
	if (previousItem && depth === previousItem.depth) {
		return previousItem.clientParentId;
	}

	// If increasing depth → parent is the previous item
	if (previousItem && depth > previousItem.depth) {
		return previousItem.clientId;
	}

	// If reordering inside same module (between lessons), keep current parent
	if (
		previousItem &&
		nextItem &&
		previousItem.clientParentId === nextItem.clientParentId &&
		previousItem.clientParentId !== null
	) {
		return previousItem.clientParentId;
	}

	// Otherwise, find the nearest ancestor at the same depth
	const newParent = newItems
		.slice(0, overItemIndex)
		.reverse()
		.find((item) => item.depth === depth)?.clientParentId;

	return newParent ?? null;
}

export function getMaxDepth({
	activeItem,
	previousItem,
	maxDepth = 2, // Default max depth (could be 3, 4, etc. for premium)
}: {
	activeItem: FlattenedCourseTreeItem;
	previousItem: FlattenedCourseTreeItem;
	maxDepth?: number;
}) {
	if (!previousItem) {
		// Nothing above → only root level allowed
		return 0;
	}

	// If dragging a module
	if (isModule(activeItem)) {
		// Modules can be at root (0) or inside another module (depth + 1),
		// but never exceed `maxDepth - 1` because children can be 1 deeper
		return Math.min(previousItem.depth + 1, maxDepth - 1);
	}

	// If dragging a lesson
	if (!isModule(activeItem)) {
		// Lessons can be inside modules, up to `maxDepth`
		if (isModule(previousItem)) {
			return Math.min(previousItem.depth + 1, maxDepth);
		}
		return Math.min(previousItem.depth, maxDepth);
	}

	// Default (just in case)
	return 0;
}

export function getMinDepth({
	nextItem,
}: {
	nextItem: FlattenedCourseTreeItem;
}) {
	if (nextItem) {
		return nextItem.depth;
	}

	return 0;
}

// export function setProperty<T extends keyof CourseTreeItem>(
// 	items: CourseTreeItem[],
// 	id: string,
// 	property: T,
// 	setter: (value: CourseTreeItem[T]) => CourseTreeItem[T]
// ) {
// 	for (const item of items) {
// 		if (item.clientId === id) {
// 			item[property] = setter(item[property]);
// 			continue;
// 		}

// 		if (item.children.length) {
// 			item.children = setProperty(item.children, id, property, setter);
// 		}
// 	}

// 	return [...items];
// }

export function setProperty<T extends keyof CourseTreeItem>(
	items: CourseTreeItem[],
	id: string,
	property: T,
	setter: (value: CourseTreeItem[T]) => CourseTreeItem[T]
): CourseTreeItem[] {
	return items.map((item) => {
		if (item.clientId === id) {
			return {
				...item,
				[property]: setter(item[property]),
			};
		}

		if (item.children.length) {
			return {
				...item,
				children: setProperty(item.children, id, property, setter),
			};
		}

		return item;
	});
}

/**
 * Assigns `.order` to each item based on position within its sibling group.
 * Sibling groups are determined by `parentId`.
 */
export function assignSiblingOrder(
	items: FlattenedCourseTreeItem[]
): FlattenedCourseTreeItem[] {
	// Group items by their parentId
	const grouped = new Map<string | null, FlattenedCourseTreeItem[]>();

	for (const item of items) {
		const group = grouped.get(item.clientParentId) || [];
		group.push(item);
		grouped.set(item.clientParentId, group);
	}

	// Assign order within each group
	const itemsWithOrder: FlattenedCourseTreeItem[] = [];

	for (const [, group] of grouped) {
		group.forEach((item, index) => {
			itemsWithOrder.push({
				...item,
				order: index,
			});
		});
	}

	return itemsWithOrder;
}

// type RootItem = CourseTreeItem & { type: "root" };

export function buildTree(
	flattenedItems: FlattenedCourseTreeItem[]
): CourseTreeItem[] {
	const root: CourseTreeItem = {
		clientId: "root",
		children: [],
		id: 0,
		type: "module",
		title: "root",
		order: 0,
		contentId: 0,
		parentId: null,
		isPublished: true,
	};
	const nodes: Record<string, CourseTreeItem> = { [root.clientId]: root };
	// Clone and register all nodes
	for (const item of flattenedItems) {
		nodes[item.clientId] = {
			...item,
			children: [],
		};
	}

	// Build hierarchy
	for (const item of flattenedItems) {
		const parentId = item.clientParentId ?? root.clientId;
		const parent = nodes[parentId];

		if (parent) {
			parent.children.push(nodes[item.clientId]);
		} else {
			console.warn(`Parent ${parentId} not found for item`, item);
		}
	}
	return root.children;
}

export function removeChildrenOf(
	items: FlattenedCourseTreeItem[],
	ids: string[]
) {
	const excludeParentIds = [...ids];

	return items.filter((item) => {
		if (
			item.clientParentId &&
			excludeParentIds.includes(item.clientParentId)
		) {
			if (item.children.length) {
				excludeParentIds.push(item.clientId);
			}
			return false;
		}

		return true;
	});
}

export function isLesson(item: FlattenedCourseTreeItem): boolean {
	return item.type === "lesson";
}

export function isModule(item: FlattenedCourseTreeItem): boolean {
	return item.type === "module";
}

export function isTopLevel(item: FlattenedCourseTreeItem): boolean {
	return item.clientParentId === null;
}
