import { assignClientIds, flattenCourseNodes } from "../../src/utils";
import { beforeAll, beforeEach, it, expect, describe } from "vitest";
import type {
	CourseTreeItem,
	CourseTreeItemUpsert,
} from "@pete_keen/courses-core/validators";

describe("assignClientIds", () => {
	it("assigns depth-index based clientIds to a nested tree", () => {
		const tree: CourseTreeItem[] = [
			{
				id: 1,
				type: "module",
				title: "Module 1",
				order: 0,
				contentId: 101,
				isPublished: true,
				clientId: "",
				collapsed: false,
				children: [
					{
						id: 2,
						type: "lesson",
						title: "Lesson 1.1",
						order: 0,
						contentId: 102,
						isPublished: true,
						clientId: "",
						collapsed: false,
						children: [],
						parentId: 1,
					},
					{
						id: 3,
						type: "lesson",
						title: "Lesson 1.2",
						order: 1,
						contentId: 103,
						isPublished: true,
						clientId: "",
						collapsed: false,
						children: [],
						parentId: 1,
					},
				],
				parentId: null,
			},
		];

		assignClientIds(tree);

		expect(tree[0].clientId).toBe("0-0");
		expect(tree[0].children[0].clientId).toBe("0-0-1-0");
		expect(tree[0].children[1].clientId).toBe("0-0-1-1");
	});
});

describe("flattenCourseNodes", () => {
	it("flattens a nested course tree with correct parent relationships", () => {
		const tree: CourseTreeItemUpsert[] = [
			{
				id: 1,
				order: 0,
				contentId: 101,
				children: [
					{
						id: 2,
						order: 0,
						contentId: 102,
						children: [],
					},
					{
						id: 3,
						order: 1,
						contentId: 103,
						children: [],
					},
				],
			},
		];

		const flat = flattenCourseNodes(tree, null);

		expect(flat).toHaveLength(3);

		expect(flat).toEqual([
			{ id: 1, order: 0, contentId: 101, parentId: null },
			{ id: 2, order: 0, contentId: 102, parentId: 1 },
			{ id: 3, order: 1, contentId: 103, parentId: 1 },
		]);
	});

	it("supports new nodes without IDs", () => {
		const tree: CourseTreeItemUpsert[] = [
			{
				order: 0,
				contentId: 201,
				children: [
					{
						order: 0,
						contentId: 202,
						children: [],
					},
				],
			},
		];

		const flat = flattenCourseNodes(tree, null);

		expect(flat).toEqual([
			{ id: undefined, order: 0, contentId: 201, parentId: null },
			{ id: undefined, order: 0, contentId: 202, parentId: null }, // parentId is null because parent has no id
		]);
	});
});