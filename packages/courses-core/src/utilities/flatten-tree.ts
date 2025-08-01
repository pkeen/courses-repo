import { UpsertBaseNode, UpsertNestedNode, UpsertFlatNode } from "validators";

export function flattenTree(input: UpsertNestedNode[]): UpsertFlatNode[] {
	const flattenedNodes: UpsertFlatNode[] = [];

	const flatten = (nodes: UpsertNestedNode[]) => {
		nodes.forEach((n) => {
			const { children, ...rest } = n;
			flattenedNodes.push(rest);
			children && flatten(children);
		});
	};

	flatten(input);

	return flattenedNodes;
}
