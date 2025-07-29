import { it, describe, expect } from "vitest";
import { flatten } from "../../src/components/admin/course/CourseEditForm/SortableTree/utilities";
import { CourseTreeItem } from "../../src/components/admin/course/CourseEditForm/SortableTree/components/types";

describe("flatten function", () => {
	const input: CourseTreeItem[] = [
		{
			id: 1,
			type: "module",
			title: "Module 1",
			order: 0,
			contentId: 1,
			clientId: "apple",
			parentId: null,
			children: [
				{
					id: 2,
					type: "lesson",
					title: "lesson1",
					order: 0,
					contentId: 2,
					clientId: "orange",
					parentId: 1,
					children: [],
				},
			],
		},
	];

	it("Does what it does...", () => {
		const result = flatten(input);
		console.log(result);
	});
});
