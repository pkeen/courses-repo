/*
 * Deprecating this for the more pure buildSyncPlan etc
TODO
*/


import { CourseNodeCreateDTO, CourseNodeDTO, UpsertFlatNode } from "validators";

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
	const existingMap = new Map(existing.map((n) => [n.id, n]));
	const incomingMap = new Map(
		incoming.filter((n) => n.id).map((n) => [n.id!, n])
	);

	const toDelete = existing.filter((n) => !incomingMap.has(n.id));
	const toCreate = incoming.filter((n) => !n.id);
	const toUpdate = incoming.filter((n) => {
		if (!n.id) return false;
		const old = existingMap.get(n.id);
		return (
			old &&
			(old.order !== n.order ||
				n.movedParentId !== undefined ||
				old.contentId !== n.contentId)
		);
	});
	console.log("existing", existing);
	console.log("incoming map", incomingMap);
	console.log("ToCreate", toCreate);
	console.log("toUpdate", toUpdate);
	console.log("toDelete", toDelete);

	// Topological sort toCreate based on clientParentId
	const sortedToCreate: UpsertFlatNode[] = [];
	const visited = new Set<string>();
	// quick lookup from a clientId to the actual node object (avoids scanning the whole array each time).
	const nodeMap = Object.fromEntries(toCreate.map((n) => [n.clientId, n]));
	const visit = (id: string) => {
		if (visited.has(id)) return;
		visited.add(id);
		// should this be matching clientId not id?
		const children = toCreate.filter((n) => n.clientParentId === id);
		for (const child of children) visit(child.clientId);
		if (nodeMap[id]) sortedToCreate.push(nodeMap[id]);
	};
	const roots = toCreate.filter(
		(n) => !n.clientParentId || !nodeMap[n.clientParentId] // parent exists but is NOT a new node);
	);
	// ^^ uses clientParentId instead of parentId because parentId will be unkown of newly created parent nodes
	for (const root of roots) visit(root.clientId);
	sortedToCreate.reverse();

	const clientIdToDbId: Record<string, number> = {};
	incomingMap.forEach((n) => {
		if (n.id) clientIdToDbId[n.clientId] = n.id;
	});

	for (const node of sortedToCreate) {
		console.log("creating", node);
		const parentId = node.clientParentId
			? clientIdToDbId[node.clientParentId]
			: null;
		const id = await insertNode({
			courseId,
			parentId,
			contentId: node.contentId,
			order: node.order,
		});
		clientIdToDbId[node.clientId] = id;
	}

	// NOT SURE THIS IS NECESSARY NOW
	// // 2nd pass: adjust parentId for existing nodes
	// for (const node of incoming) {
	// 	if (!node.id) continue; // skip brand new nodes

	// 	const old = existingMap.get(node.id);

	// 	// Case 1: parent is a newly created node
	// 	if (node.clientParentId) {
	// 		const newParentId = clientIdToDbId[node.clientParentId];
	// 		if (newParentId && old && old.parentId !== newParentId) {
	// 			toUpdate.push({ ...node, parentId: newParentId });
	// 		}
	// 	}

	// 	// Case 2: moved to root
	// 	// trying using root as the changer
	// 	if (node.clientParentId === null && old && old.parentId !== null) {
	// 		toUpdate.push({ ...node, parentId: null });
	// 	}
	// }

	for (const node of toUpdate) {
		const parentId = node.movedParentId
			? clientIdToDbId[node.movedParentId]
			: node.movedParentId === null
			? null
			: node.parentId;
		await updateNode({ ...node, courseId, id: node.id!, parentId });
	}

	if (toDelete.length > 0) {
		await deleteNodes(toDelete.map((n) => n.id));
	}
}
