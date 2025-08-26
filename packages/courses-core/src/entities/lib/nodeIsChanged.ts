import { CourseNodeDTO, UpsertFlatNode } from "entities/course";

/*
 * Returns true if changed - false if no change
 */
export const nodeIsDirty = (old: CourseNodeDTO, incoming: UpsertFlatNode) => {
	return (
		old.order !== incoming.order ||
		incoming.movedParentId !== undefined ||
		old.contentId !== incoming.contentId
	);
};
