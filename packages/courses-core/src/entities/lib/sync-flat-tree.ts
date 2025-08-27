/*
 * Deprecating this for the more pure buildSyncPlan etc
TODO
*/

import { CourseNodeCreateDTO, CourseNodeDTO, UpsertFlatNode } from "validators";
import { buildSyncPlan } from "./buildSyncPlan";

export async function syncFlatTree({
	courseId,
	incoming,
	existing = [],
	insertNode,
	updateNode,
	deleteNodes,
}: {
	courseId: number;
	incoming: UpsertFlatNode[];
	existing: CourseNodeDTO[];
	insertNode: (node: CourseNodeCreateDTO) => Promise<number>;
	updateNode: (input: CourseNodeDTO) => Promise<void>;
	deleteNodes: (ids: number[]) => Promise<void>;
}) {
	// Call build sync plan to create which lists of actions
	const { toCreateSorted, toDelete, toUpdate } = buildSyncPlan({
		incoming,
		existing,
	});

	// create the clientIdToDb map
	const clientIdToDbId: Record<string, number> = {};
	incoming.forEach((n) => {
		if (n.id) clientIdToDbId[n.clientId] = n.id;
	});

	/*
	 * Execute the db actions through ports
	 */

	for (const node of toCreateSorted) {
		// console.log("creating", node);
		const parentId = node.clientParentId
			? clientIdToDbId[node.clientParentId]
			: null;
		const id = await insertNode({
			courseId,
			parentId,
			contentId: node.contentId,
			order: node.order,
		});
		// Add new ids to clientToDb map
		clientIdToDbId[node.clientId] = id;
	}

	for (const node of toUpdate) {
		const parentId = node.movedParentId
			? clientIdToDbId[node.movedParentId]
			: node.movedParentId === null
			? null
			: node.parentId;
		await updateNode({ ...node, courseId, id: node.id!, parentId });
	}

	if (toDelete.length > 0) {
		await deleteNodes(toDelete);
	}
}
