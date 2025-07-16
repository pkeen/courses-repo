"use client";

import React, { CSSProperties } from "react";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TreeItem, Props as TreeItemProps } from "./TreeItem";
import { iOS } from "../../utilities";

interface Props extends TreeItemProps {
	id: string;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
	isSorting,
	wasDragging,
}) => (isSorting || wasDragging ? false : true);

export function SortableTreeItem({ id, depth, title, type, ...props }: Props) {
	const {
		attributes,
		isDragging,
		isSorting,
		listeners,
		setDraggableNodeRef,
		setDroppableNodeRef,
		transform,
		transition,
	} = useSortable({
		id,
		animateLayoutChanges,
	});
	const style: CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	// Destructure ref out of props to avoid passing it twice
	// const { ref, ...restProps } = props;
	// const { id, ...restProps } = props;

	return (
		<TreeItem
			ref={setDraggableNodeRef}
			wrapperRef={setDroppableNodeRef}
			style={style}
			depth={depth}
			ghost={isDragging}
			disableSelection={iOS}
			disableInteraction={isSorting}
			handleProps={{
				...attributes,
				...listeners,
			}}
			title={title}
			type={type}
			{...props}
		/>
	);
}
