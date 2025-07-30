import { BackendNode } from "@pete_keen/courses-core/validators";
import { SortableWrapper } from "@/lib/components/SortableWrapper";
import { buildTree } from "@pete_keen/courses-core";

const input: BackendNode[] = [
	{
		id: 3,
		parentId: null,
		order: 1,
		contentId: 3,
		clientId: "sub",
		type: "lesson",
		title: "lesson 1",
	},
	{
		id: 1,
		parentId: null,
		order: 0,
		contentId: 1,
		clientId: "sandwich",
		type: "module",
		title: "module 1",
	},
	{
		id: 2,
		parentId: 1,
		order: 0,
		contentId: 2,
		clientId: "burger",
		type: "module",
		title: "module 2",
	},
];

export default async function Page() {
	const tree = buildTree(input);
	return <SortableWrapper tree={tree} />;
}
