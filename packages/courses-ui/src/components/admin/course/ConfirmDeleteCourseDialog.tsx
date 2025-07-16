import { ConfirmActionDialog } from "../confirm-action-dialog";

export function ConfirmDeleteCourseDialog({
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
			title={`Delete Course`}
			description={`Are you sure you want to delete this course?`}
			onConfirm={onConfirm}
			open={open}
			setOpen={setOpen}
			actionVerb={"Delete"}
		/>
	);
}
