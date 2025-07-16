import { ConfirmActionDialog } from "../confirm-action-dialog";

export function ConfirmDeleteContentDialog({
	onConfirm,
	open,
	setOpen,
}: {
	onConfirm: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	return (
		<ConfirmActionDialog
			title={`Delete Content`}
			description={`Are you sure you want to delete this content?`}
			onConfirm={onConfirm}
			open={open}
			setOpen={setOpen}
			actionVerb={"Delete"}
		/>
	);
}
