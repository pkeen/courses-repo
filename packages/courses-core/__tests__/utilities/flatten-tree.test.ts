import { flattenTree } from "../../src/utilities";
import {
	UpsertBaseNode,
	UpsertNestedNode,
	UpsertFlatNode,
	upsertFlatNode,
} from "../../src/validators";
import { describe, expect, it } from "vitest";

describe("flatten tree", () => {
	it("takes a nested group of nodes and returns them as a flat tree group", () => {
		const input = [
			{
				order: 0,
				parentId: null,
				contentId: 1,
				clientId: "BHAFC",
				children: [
					{
						order: 0,
						parentId: null,
						contentId: 2,
						clientId: "CFC",
						clientParentId: "BHAFC",
						children: [],
					},
				],
			},
			{
				order: 1,
				parentId: null,
				contentId: 1,
				clientId: "MUFC",
				children: [],
			},
		];

		const result = flattenTree(input);
		console.log(result);

		expect(result).toStrictEqual([
			{
				order: 0,
				parentId: null,
				contentId: 1,
				clientId: "BHAFC",
			},
			{
				order: 0,
				parentId: null,
				contentId: 2,
				clientId: "CFC",
				clientParentId: "BHAFC",
			},
			{
				order: 1,
				parentId: null,
				contentId: 1,
				clientId: "MUFC",
			},
		]);

		const parseResult = upsertFlatNode.array().safeParse(result);

		expect(parseResult.success).toBe(true);
	});
});
