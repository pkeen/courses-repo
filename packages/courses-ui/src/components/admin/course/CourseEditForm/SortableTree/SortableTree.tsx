"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	CourseTreeItem,
	FlattenedCourseTreeItem,
	SensorContext,
} from "./components/types";
import {
	flattenTree,
	getChildCount,
	getProjection,
	removeItem,
	setProperty,
	getDragDepth,
	getMaxDepth,
	getMinDepth,
	buildTree,
	removeChildrenOf,
	isModule,
	isLesson,
	isTopLevel,
	assignSiblingOrder,
} from "./utilities";
import {
	closestCenter,
	defaultDropAnimation,
	DndContext,
	DragEndEvent,
	DragMoveEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	DropAnimation,
	KeyboardSensor,
	Modifier,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTreeItem } from "./components";
import { createPortal } from "react-dom";

interface Props {
	collapsible?: boolean;
	// initialItems?: CourseTreeItem[];
	items: CourseTreeItem[];
	onChange: (items: CourseTreeItem[]) => void;
	indentationWidth?: number;
	indicator?: boolean;
	removable?: boolean;
}

const dropAnimation: DropAnimation = {
	...defaultDropAnimation,
};

export function SortableTree({
	collapsible,
	onChange,
	items,
	indicator,
	indentationWidth = 20,
	removable,
}: Props) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const flattenedItems = useMemo(() => {
		const flattenedTree = flattenTree(items);
		const collapsedItems = flattenedTree.reduce<string[]>(
			(acc, { children, collapsed, clientId }) =>
				collapsed && children.length ? [...acc, clientId] : acc,
			[]
		);

		return removeChildrenOf(
			flattenedTree,
			activeId ? [activeId, ...collapsedItems] : collapsedItems
		);
	}, [activeId, items]);

	const [overId, setOverId] = useState<string | null>(null);
	const [offsetLeft, setOffsetLeft] = useState(0);
	const [currentPosition, setCurrentPosition] = useState<{
		clientParentId: string | null;
		overId: string;
	} | null>(null);

	const sensorContext: SensorContext = useRef({
		items: flattenedItems,
		offset: offsetLeft,
	});

	const sortedIds = useMemo(
		() => flattenedItems.map(({ clientId }) => clientId), 
		[flattenedItems]
	);

	const activeItem = activeId
		? flattenedItems.find(({ clientId }) => clientId === activeId)
		: null;

	const projected =
		activeId && overId
			? getProjection(
					flattenedItems,
					activeId.toString(),
					overId.toString(),
					offsetLeft,
					indentationWidth
			  )
			: null;

	const sensors = useSensors(
		useSensor(PointerSensor)
		// useSensor(KeyboardSensor, {
		// 	coordinateGetter,
		// })
	);

	useEffect(() => {
		sensorContext.current = {
			items: flattenedItems,
			offset: offsetLeft,
		};
	}, [flattenedItems, offsetLeft]);

	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return (
		<DndContext
			collisionDetection={closestCenter}
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<SortableContext
				items={sortedIds}
				strategy={verticalListSortingStrategy}
			>
				{flattenedItems.map(
					({ clientId, title, depth, collapsed, children, type }) => (
						<SortableTreeItem
							key={clientId}
							id={clientId}
							value={clientId}
							title={title}
							type={type}
							// ref={setDroppableNodeRef}
							depth={
								clientId === activeId && projected
									? projected.depth
									: depth
							}
							indentationWidth={indentationWidth}
							indicator={indicator}
							collapsed={Boolean(collapsed && children.length)}
							onCollapse={
								collapsible && children.length
									? () => handleCollapse(clientId)
									: undefined
							}
							onRemove={
								removable
									? () => handleRemove(clientId)
									: undefined
							}
						/>
					)
				)}
				{hasMounted &&
					createPortal(
						<DragOverlay
							dropAnimation={dropAnimation}
							modifiers={
								indicator ? [adjustTranslate] : undefined
							}
						>
							{activeId && activeItem ? (
								<SortableTreeItem
									title={activeItem.title}
									id={activeItem.clientId}
									type={activeItem.type}
									depth={activeItem.depth}
									clone
									childCount={
										getChildCount(
											items,
											activeItem.clientId
										) + 1
									}
									value={activeItem.clientId}
									indentationWidth={indentationWidth}
								/>
							) : null}
						</DragOverlay>,
						document.body
					)}
			</SortableContext>
		</DndContext>
	);

	function handleRemove(clientId: string) {
		onChange(removeItem(items, clientId));
	}

	function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
		setActiveId(activeId.toString());
		setOverId(activeId.toString());

		const activeItem = flattenedItems.find(
			({ clientId }) => clientId === activeId
		);

		if (activeItem) {
			setCurrentPosition({
				clientParentId: activeItem.clientParentId,
				overId: activeId.toString(),
			});
		}

		document.body.style.setProperty("cursor", "grabbing");
	}

	function handleDragMove({ delta }: DragMoveEvent) {
		setOffsetLeft(delta.x);
	}

	function handleDragOver({ over }: DragOverEvent) {
		const newOverId = over?.id?.toString() ?? null;
		console.log("handleDragOver → overId:", newOverId);
		setOverId(newOverId);
	}

	function handleDragEnd({ active, over }: DragEndEvent) {
		resetState();

		if (!over) return;

		const clonedItems = flattenTree(items); // or deep clone if needed
		// console.log("clonedItems", clonedItems);
		const activeId = active.id.toString();
		const overId = over.id.toString();

		const activeItem = clonedItems.find(
			(item) => item.clientId === activeId
		);
		if (!activeItem) return;
		const overItem = clonedItems.find((item) => item.clientId === overId);
		// console.log("overItem", overItem);
		if (!overItem) return;

		const projection = getProjection(
			clonedItems,
			activeId,
			overId,
			offsetLeft,
			indentationWidth
		);
		if (!projection) return;

		const { depth, clientParentId } = projection;

		// Enforce nesting rules
		if (isModule(activeItem)) {
			// Limit nesting depth of modules
			const MAX_MODULE_DEPTH = 2; // 👈 set your limit here
			if (depth > MAX_MODULE_DEPTH) return;

			// Optionally ensure it's only under other modules or root
			if (clientParentId !== null) {
				const parentItem = clonedItems.find(
					(item) => item.clientId === clientParentId
				);
				if (!parentItem || !isModule(parentItem)) return;
			} // Modules can only be top level
		} else {
			// Non-module items can be top-level or under modules
			if (clientParentId === null) {
				// it's going to root — allow it
			} else {
				const parentItem = clonedItems.find(
					(item) => item.clientId === clientParentId
				);
				if (!parentItem || !isModule(parentItem)) return;
			}
		}

		const activeIndex = clonedItems.findIndex(
			(item) => item.clientId === activeId
		);
		const overIndex = clonedItems.findIndex(
			(item) => item.clientId === overId
		);

		clonedItems[activeIndex] = {
			...clonedItems[activeIndex],
			depth,
			clientParentId: clientParentId?.toString() ?? null,
		};

		const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
		const orderedItems = assignSiblingOrder(sortedItems);
		const newTree = buildTree(orderedItems);

		console.log("Built new tree", newTree);
		onChange(newTree);
	}

	function resetState() {
		setOverId(null);
		setActiveId(null);
		setOffsetLeft(0);
		setCurrentPosition(null);

		document.body.style.setProperty("cursor", "");
	}

	function handleDragCancel() {
		resetState();
	}

	function handleCollapse(clientId: string) {
		onChange(setProperty(items, clientId, "collapsed", (value) => !value));
	}
}

const adjustTranslate: Modifier = ({ transform }) => {
	return {
		...transform,
		y: transform.y - 25,
	};
};
