import { CourseNodeDTO, UpsertFlatNode } from "validators";

// interface FlatNodesHelperReturnType {
//     toCreate
// }

// export const syncFlatCourseNodesHelper = (existingNodes: CourseNodeDTO) => {

// }

// Full refactored sync function for client-linked flat tree

// type UpsertFlatNode = {
//   id?: number;
//   clientId: string;
//   clientParentId?: string | null;
//   contentId: number;
//   order: number;
//   parentId?: number | null;
// };
export async function syncFlatTree({
	courseId,
	incoming,
	existing,
	insertNode,
	updateNode,
	deleteNodes,
}: {
	courseId: number;
	incoming: UpsertFlatNode[];
	existing: {
		id: number;
		contentId: number;
		parentId: number | null;
		order: number;
	}[];
	insertNode: (node: {
		courseId: number;
		parentId: number | null;
		contentId: number;
		order: number;
	}) => Promise<number>;
	updateNode: (
		id: number,
		node: Partial<{
			parentId: number | null;
			contentId: number;
			order: number;
		}>
	) => Promise<void>;
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
				old.parentId !== n.parentId ||
				old.contentId !== n.contentId)
		);
	});

	console.log("toUpdate", toUpdate);

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
	const roots = toCreate.filter((n) => !n.clientParentId);
	// ^^ uses clientParentId instead of parentId because parentId will be unkown of newly created parent nodes
	for (const root of roots) visit(root.clientId);
	sortedToCreate.reverse();

	const clientIdToDbId: Record<string, number> = {};
	incomingMap.forEach((n) => {
		if (n.id) clientIdToDbId[n.clientId] = n.id;
	});

	for (const node of sortedToCreate) {
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

	for (const node of toUpdate) {
		const parentId = node.clientParentId
			? clientIdToDbId[node.clientParentId]
			: node.parentId;
		await updateNode(node.id!, {
			contentId: node.contentId,
			order: node.order,
			parentId,
		});
	}

	if (toDelete.length > 0) {
		await deleteNodes(toDelete.map((n) => n.id));
	}
}
