import { CourseTreeItem, BackendNode } from "validators";

export function buildTree(nodes: BackendNode[]): CourseTreeItem[] {
	// STEP 1 – create lookup with empty children
	const table = new Map<number, CourseTreeItem>();
	nodes.forEach(
		(n) => table.set(n.id, { ...n, children: [] }) // spread keeps type safety
	);

	// STEP 2 – wire up parent → children
	const roots: CourseTreeItem[] = [];
	table.forEach((node) => {
		if (node.parentId == null) {
			roots.push(node);
		} else {
			const parent = table.get(node.parentId);
			parent?.children.push(node);
		}
	});

	// STEP 3 – honour your explicit sort order
	table.forEach((n) => n.children.sort((a, b) => a.order - b.order));
	roots.sort((a, b) => a.order - b.order);

	return roots;
}
