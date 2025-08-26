/*
 * TODO: Deprecate syncFlatTree and replace it with purer functions
        BuildSyncPlan
        TopologicalSort etc
*/

import { CourseNodeCreateDTO, CourseNodeDTO, UpsertFlatNode } from "../course";

export type SyncPlan = {
	toCreateSorted: Array<{ create: CourseNodeCreateDTO; clientId: string }>;
	toUpdate: Array<{
		id: number;
		parentId: number | null;
		order: number;
		contentId: number | null;
	}>;
	toDelete: number[];
};

export function buildSyncPlan(params: {
	courseId: number;
	incoming: UpsertFlatNode[];
	existing: CourseNodeDTO[];
}): SyncPlan {
	// 100% pure: compute toCreateSorted, toUpdate, toDelete
	// – do your Maps, diffs, topological sort by clientParentId, etc.
	// – no console.log, no fetch, no insert/update/delete calls.
	// – return the plan plus any mapping you need.

	// params
	const { courseId, incoming, existing } = params;

	// Create incoming existing maps
	const existingMap = new Map(existing.map((n) => [n.id, n]));
	const incomingMap = new Map(
		incoming.filter((n) => n.id).map((n) => [n.id!, n])
	);

	// Create first pass action filters
	const toDelete = existing.filter((n) => !incomingMap.has(n.id));
	const toCreate = incoming.filter((n) => !n.id);
	const toUpdate = incoming.filter((n) => {
		if (!n.id) return false;
		const old = existingMap.get(n.id);
		return (
			old &&
			(old.order !== n.order ||
				n.movedParentId !== undefined ||
				old.contentId !== n.contentId)
		);
	});
	// Temporary logs
	console.log("existing", existing);
	console.log("incoming map", incomingMap);
	console.log("ToCreate", toCreate);
	console.log("toUpdate", toUpdate);
	console.log("toDelete", toDelete);

	// TODO: COmplete this - but the problem is that clientIdToDbId depends on the newly created ids from sortedToCreate, so its not quite as simple as returning the lists and running them
	// may be better still using the dependency injection and running this from the application layer

	return { toCreateSorted: [], toUpdate: [], toDelete: [] };
}
