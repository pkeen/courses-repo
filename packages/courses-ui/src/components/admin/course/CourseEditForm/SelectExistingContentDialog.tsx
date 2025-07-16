"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { ScrollArea } from "../../../ui/scroll-area";
import { useState } from "react";
import { ContentItemDTO } from "@pete_keen/courses-core/validators";

interface SelectExistingContentProps {
	title: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: ContentItemDTO[];
	onSelect: (item: ContentItemDTO) => void;
}

export function SelectExistingContentDialog({
	title,
	open,
	onOpenChange,
	items,
	onSelect,
}: SelectExistingContentProps) {
	const [search, setSearch] = useState("");

	const filteredItems = items.filter((item) =>
		item.title.toLowerCase().includes(search.toLowerCase())
	);

	const handleSelect = (item: ContentItemDTO) => {
		onSelect(item);
		onOpenChange(false); // Close after selecting
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<Input
					placeholder="Search Content..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<ScrollArea className="max-h-60">
					<div className="flex flex-col gap-2 py-2">
						{filteredItems.map((item) => (
							<Button
								key={item.id}
								variant="ghost"
								className="justify-start"
								onClick={() => handleSelect(item)}
							>
								<div className="flex flex-row gap-2">
									<div className="font-medium">
										{item.title}
									</div>
									<div className="text-sm text-muted-foreground">
										{item.type}
									</div>
								</div>
							</Button>
						))}
					</div>
				</ScrollArea>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
