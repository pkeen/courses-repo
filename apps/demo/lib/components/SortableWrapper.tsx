"use client";

import { useState } from "react";
import { SortableTree } from "@pete_keen/courses-ui";

export function SortableWrapper({ tree }: { tree: any }) {
	const [items, setItems] = useState(tree);

	return <SortableTree items={items} onChange={setItems} />;
}
