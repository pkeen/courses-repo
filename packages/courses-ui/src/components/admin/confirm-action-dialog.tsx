import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface ConfirmActionDialogProps {
	trigger?: React.ReactNode;
	title: string;
	description: string;
	onConfirm: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
	actionVerb: string;
}

export function ConfirmActionDialog({
	trigger,
	title,
	description,
	onConfirm,
	open,
	setOpen,
	children,
	actionVerb,
}: ConfirmActionDialogProps) {
	const [loading, setLoading] = useState(false);

	async function handleConfirm() {
		try {
			setLoading(true);
			await onConfirm();
			setOpen(false);
		} finally {
			setLoading(false);
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>} */}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<p>{description}</p>
				{children}
				<div className="flex justify-end gap-2 mt-4">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={() => handleConfirm()} disabled={loading}>
						{loading ? `${actionVerb}ing...` : actionVerb}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
