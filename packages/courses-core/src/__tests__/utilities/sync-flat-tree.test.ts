import { CourseNodeDTO, UpsertFlatNode } from "validators";
import { syncFlatTree } from "../../utilities/sync-flat-tree";
import { describe, expect, it, vi } from "vitest";

describe("syncFlatTree test:", () => {
	it("Creates topological sort and create for all new nodes", async () => {
		const existing: CourseNodeDTO[] = [];
		const incoming: UpsertFlatNode[] = [
			{ clientId: "parent", order: 0, contentId: 1, parentId: null },
			{
				clientId: "child1",
				clientParentId: "parent",
				order: 0,
				contentId: 2,
				parentId: null,
			},
			{
				clientId: "child2",
				clientParentId: "parent",
				order: 1,
				contentId: 3,
				parentId: null,
			},
			{
				clientId: "grandchild",
				clientParentId: "child1",
				order: 0,
				contentId: 4,
				parentId: null,
			},
		];

		// Mock DB adapters
		const insertOrder: string[] = [];
		let nextId = 1;
		const insertNode = vi.fn(async (node) => {
			insertOrder.push(`${node.contentId}`);
			return nextId++;
		});
		const updateNode = vi.fn(async () => {});
		const deleteNodes = vi.fn(async () => {});

		await syncFlatTree({
			courseId: 1,
			incoming,
			existing,
			insertNode,
			updateNode,
			deleteNodes,
		});

		const pos = (id: number) => insertOrder.indexOf(id.toString());

		// Assert parent before children
		expect(pos(1)).toBeLessThan(pos(2)); // parent before child1
		expect(pos(1)).toBeLessThan(pos(3)); // parent before child2
		expect(pos(2)).toBeLessThan(pos(4)); // child1 before grandchild

		expect(insertNode).toHaveBeenCalledTimes(4);
		expect(updateNode).not.toHaveBeenCalled();
		expect(deleteNodes).not.toHaveBeenCalled();
	});

	it("Calls the correct create, update, delete funcions for data provided", async () => {
		const existing: CourseNodeDTO[] = [
			{
				// to be deleted
				id: 1,
				courseId: 1,
				parentId: null,
				order: 0,
				contentId: 1,
			},
			{
				// to be moved to nested under a new node
				id: 2,
				courseId: 1,
				parentId: null,
				order: 1,
				contentId: 2,
			},
		];

		const incoming: UpsertFlatNode[] = [
			{ clientId: "parent", order: 0, contentId: 1, parentId: null },
			{
				clientId: "child1",
				clientParentId: "parent",
				order: 0,
				contentId: 2,
				parentId: null,
			},
			{
				clientId: "child2",
				clientParentId: "parent",
				order: 1,
				contentId: 3,
				parentId: null,
			},
			{
				// this is existing and updated to nested under a new node
				id: 2,
				parentId: null,
				order: 2,
				contentId: 2,
				clientId: "child3",
				clientParentId: "parent",
			},
			{
				clientId: "grandchild",
				clientParentId: "child1",
				order: 0,
				contentId: 4,
				parentId: null,
			},
		];

		// Mock DB adapters
		const insertOrder: string[] = [];
		let nextId = 3; // bc 1 and 2 were taken in this test
		const insertNode = vi.fn(async (node) => {
			insertOrder.push(`${node.contentId}`);
			return nextId++;
		});
		const updateNode = vi.fn(async () => {});
		const deleteNodes = vi.fn(async () => {});

		await syncFlatTree({
			courseId: 1,
			incoming,
			existing,
			insertNode,
			updateNode,
			deleteNodes,
		});

		const pos = (id: number) => insertOrder.indexOf(id.toString());

		// Assert parent before children
		expect(pos(1)).toBeLessThan(pos(2)); // parent before child1
		expect(pos(1)).toBeLessThan(pos(3)); // parent before child2
		expect(pos(2)).toBeLessThan(pos(4)); // child1 before grandchild

		expect(insertNode).toHaveBeenCalledTimes(4);
		expect(updateNode).toHaveBeenCalledTimes(1);
		expect(deleteNodes).toHaveBeenCalledTimes(1);
	});
});
