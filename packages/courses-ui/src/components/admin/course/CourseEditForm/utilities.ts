import {
	UpsertNestedNode,
	ContentType,
} from "@pete_keen/courses-core/validators";

export type DisplayNestedNode = {
	// all properties from UpsertNestedNode
	id?: number;
	clientId: string;
	clientParentId?: string | null;
	movedParentId?: string | null;
	type: ContentType;
	title: string;
	children: DisplayNestedNode[];
	isPublished?: boolean;
	order: number;
	contentId: number;
	parentId: number | null;
	// add any other fields you're using
};

export function ensureDisplayNodes(
	nodes: UpsertNestedNode[]
): DisplayNestedNode[] {
	return nodes.map((node) => ({
		...node,
		type: node.type ?? "lesson", // or throw an error if it's critical
		title: node.title ?? "(Untitled)",
		children: node.children ? ensureDisplayNodes(node.children) : [],
	}));
}
