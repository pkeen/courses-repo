/*
 * TODO: Deprecate syncFlatTree and replace it with purer functions
        BuildSyncPlan
        TopologicalSort etc


    TODO: Decide:
        -- my hesitation is this is perhaps interface layer stuff seeping into core. 
        Does the core care about this? It feels more like SQL based adapter helpers. 
        What if the storage actually didnt keep courseNodes in seperate table but as json attached to course?
            None of this would be needed would it?
*/

import { CourseNodeCreateDTO, CourseNodeDTO, UpsertFlatNode } from "../course";
import { nodeIsDirty } from "./nodeIsDirty";
import { topologicalSortNewNodes } from "./topologicalSortNewNodes";

export type SyncPlan = {
	toCreateSorted: UpsertFlatNode[];
	toUpdate: UpsertFlatNode[];
	toDelete: number[]; // only id needed here
};

export function buildSyncPlan(params: {
	incoming: UpsertFlatNode[];
	existing: CourseNodeDTO[];
}): SyncPlan {
	// 100% pure: compute toCreateSorted, toUpdate, toDelete
	// – do your Maps, diffs, topological sort by clientParentId, etc.
	// – no console.log, no fetch, no insert/update/delete calls.
	// – return the plan plus any mapping you need.
	// params
	const { incoming, existing } = params;

	// Create incoming existing maps
	const existingMap = new Map(existing.map((n) => [n.id, n]));
	const incomingMap = new Map(
		incoming.filter((n) => n.id).map((n) => [n.id!, n])
	);

	// Create first pass action filters
	// const toDelete = existing.filter((n) => !incomingMap.has(n.id));
	const toDelete = existing
		.filter((n) => !incomingMap.has(n.id))
		.map((n) => n.id);
	const toCreate = incoming.filter((n) => !n.id);
	const toUpdate = incoming.filter((n) => {
		if (!n.id) return false;
		const old = existingMap.get(n.id);
		return old && nodeIsDirty(old, n);
	});
	// // Temporary logs
	// console.log("existing", existing);
	// console.log("incoming map", incomingMap);
	// console.log("toCreate", toCreate);
	// console.log("toUpdate", toUpdate);
	// console.log("toDelete", toDelete);

	// calls topologicalSort for new nodes
	const toCreateSorted = topologicalSortNewNodes(toCreate);

	// TODO: COmplete this - but the problem is that clientIdToDbId depends on the newly created ids from sortedToCreate, so its not quite as simple as returning the lists and running them
	// may be better still using the dependency injection and running this from the application layer

	return { toCreateSorted, toUpdate, toDelete };
}
