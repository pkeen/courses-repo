"use client";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { useState } from "react";

interface AddContentDialogProps {
	trigger: React.ReactNode; // What opens the modal (e.g. the "+ Add Module" button)
	title: string; // Title like "Add Module" or "Add Lesson"
	onSelect: (choice: "new" | "existing") => void; // Callback with user choice
}

export function AddContentDialog({
	trigger,
	title,
	onSelect,
}: AddContentDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSelect = (choice: "new" | "existing") => {
		onSelect(choice);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-4">
					{/* <Button
						variant="default"
						onClick={() => handleSelect("new")}
					>
						+ Create New
					</Button> */}
					<Button
						variant="secondary"
						onClick={() => handleSelect("existing")}
					>
						🔍 Select Existing
					</Button>
					<Button>Add New</Button>
				</div>

				<DialogFooter>
					<Button variant="ghost" onClick={() => setOpen(false)}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
