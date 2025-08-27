import { UpsertFlatNode } from "entities/course";

// TDOD: add tests

export const topologicalSortNewNodes = (
	toCreate: UpsertFlatNode[]
): UpsertFlatNode[] => {
	// Topological sort toCreate based on clientParentId
	const sortedToCreate: UpsertFlatNode[] = [];
	const visited = new Set<string>();
	// quick lookup from a clientId to the actual node object (avoids scanning the whole array each time).
	const nodeMap = Object.fromEntries(toCreate.map((n) => [n.clientId, n]));
	const visit = (id: string) => {
		if (visited.has(id)) return;
		visited.add(id);
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

	return sortedToCreate;
};
