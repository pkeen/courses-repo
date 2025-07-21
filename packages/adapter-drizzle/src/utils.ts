import {
	CourseTreeItem,
	CourseTreeItemUpsert,
} from "@pete_keen/courses-core/validators";

export function assignClientIds(
	nodes: CourseTreeItem[],
	parentClientId: string = "",
	depth: number = 0
): void {
	nodes.forEach((node, index) => {
		node.clientId = `${parentClientId}${depth}-${index}`;
		assignClientIds(node.children, `${node.clientId}-`, depth + 1);
	});
}

export const flattenCourseNodes = (
	nodes: CourseTreeItemUpsert[],
	parentId: number | null,
	flat: {
		id?: number;
		order: number;
		contentId: number;
		parentId: number | null;
	}[] = []
): typeof flat => {
	for (const node of nodes) {
		flat.push({
			id: node.id,
			order: node.order,
			contentId: node.contentId,
			parentId,
		});
		if (node.children) {
			flattenCourseNodes(node.children, node.id ?? null, flat);
		}
	}
	return flat;
};
