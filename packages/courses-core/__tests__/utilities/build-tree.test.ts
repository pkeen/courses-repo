import { buildTree } from "../../src/utilities/build-tree";
import { BackendNode, courseTreeItem } from "../../src/validators";
import { describe, it, expect, test } from "vitest";
import z from "zod";

type CourseTreeItem = z.infer<typeof courseTreeItem>;
const courseTreeArray = z.array(courseTreeItem);
type CourseTreeArray = z.infer<typeof courseTreeArray>;

const input: BackendNode[] = [
	{
		id: 3,
		parentId: null,
		order: 1,
		contentId: 3,
		clientId: "sub",
		type: "lesson",
		title: "lesson 1",
	},
	{
		id: 1,
		parentId: null,
		order: 0,
		contentId: 1,
		clientId: "sandwich",
		type: "module",
		title: "module 1",
	},
	{
		id: 2,
		parentId: 1,
		order: 0,
		contentId: 2,
		clientId: "burger",
		type: "module",
		title: "module 2",
	},
];

describe("buildTree - function to turn flat backend structure into tree for frontend", () => {
	it("changes types from flat to nested object", () => {
		const result = buildTree(input);
		console.log(result);
		const parseResult = courseTreeArray.safeParse(result);
		expect(parseResult.success).toEqual(true);
	});

	test("Succesfully reorders the data according to order field", () => {
		const result = buildTree(input);

		const recursiveCheckOrder = (items: CourseTreeItem[]) => {
			let prevOrder = -1;
			items.forEach((i) => {
				console.log("title", i.title);
				console.log("order", i.order);
				console.log("previous order", prevOrder);
				expect(i.order).toBeGreaterThan(prevOrder);
				prevOrder = i.order;
				i.children && recursiveCheckOrder(i.children);
			});
		};

		recursiveCheckOrder(result);
	});
});
