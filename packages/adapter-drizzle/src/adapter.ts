import { ContentItemCRUD, CourseCRUD } from "@pete_keen/courses-core/types";
import {
	createSchema,
	DrizzleDbWithSchema,
	DefaultSchema,
	DrizzleDatabase,
} from "./schema";
import {
	contentItemDTO,
	ContentItemDTO,
	ContentType,
	CourseDTO,
	courseDTO,
	CourseNodeUpsert,
	CourseTreeDTO,
	courseTreeDTO,
	CourseTreeItem,
	CourseTreeItemUpsert,
	CreateCourseFlatNodesInput,
	createCourseFlatNodesInput,
	CreateCourseTreeDTO,
	CreateFullContentItem,
	EditCourseTreeDTO,
	fullContentItem,
	FullContentItem,
} from "@pete_keen/courses-core/validators";
import { eq, inArray } from "drizzle-orm";
import { assignClientIds, flattenCourseNodes } from "./utils";

// const defaultSchema = createSchema();

const toDBId = (id: string): number => parseInt(id, 10);

const createCRUD = (
	db: DrizzleDatabase,
	schema: DefaultSchema
): {
	course: CourseCRUD;
	content: ContentItemCRUD;
} => {
	const createCourseRepo = (db: DrizzleDatabase) => {
		// function assignClientIds(
		// 	nodes: CourseTreeItem[],
		// 	parentClientId: string = "",
		// 	depth: number = 0
		// ): void {
		// 	nodes.forEach((node, index) => {
		// 		node.clientId = `${parentClientId}${depth}-${index}`;
		// 		assignClientIds(node.children, `${node.clientId}-`, depth + 1);
		// 	});
		// }

		// const flattenCourseNodes = (
		// 	nodes: CourseTreeItemUpsert[],
		// 	parentId: number | null,
		// 	flat: {
		// 		id?: number;
		// 		order: number;
		// 		contentId: number;
		// 		parentId: number | null;
		// 	}[] = []
		// ): typeof flat => {
		// 	for (const node of nodes) {
		// 		flat.push({
		// 			id: node.id,
		// 			order: node.order,
		// 			contentId: node.contentId,
		// 			parentId,
		// 		});
		// 		if (node.children) {
		// 			flattenCourseNodes(node.children, node.id ?? null, flat);
		// 		}
		// 	}
		// 	return flat;
		// };

		const syncCourseTree = async (
			courseId: number,
			incomingItems: CourseTreeItemUpsert[]
		) => {
			const flatIncoming = flattenCourseNodes(incomingItems, null);

			// const existing = await db.query.courseNode.findMany({
			// 	where: eq(schema.courseNode.courseId, courseId),
			// });
			const existing = await db
				.select()
				.from(schema.courseNode)
				.where(eq(schema.courseNode.courseId, courseId));

			const existingMap = new Map(existing.map((n) => [n.id, n]));

			const incomingMap = new Map(
				flatIncoming.filter((n) => n.id).map((n) => [n.id!, n])
			);

			const toDelete = existing.filter((n) => !incomingMap.has(n.id));
			const toCreate = flatIncoming.filter((n) => !n.id);
			const toUpdate = flatIncoming.filter((n) => {
				if (!n.id) return false;
				const old = existingMap.get(n.id);
				return (
					old &&
					(old.order !== n.order ||
						old.parentId !== n.parentId ||
						old.contentId !== n.contentId)
				);
			});

			// DELETE
			if (toDelete.length) {
				await db.delete(schema.courseNode).where(
					inArray(
						schema.courseNode.id,
						toDelete.map((n) => n.id)
					)
				);
			}

			// UPDATE
			for (const n of toUpdate) {
				await db
					.update(schema.courseNode)
					.set({
						order: n.order,
						parentId: n.parentId,
						contentId: n.contentId,
					})
					.where(eq(schema.courseNode.id, n.id!));
			}

			// CREATE
			if (toCreate.length) {
				await db.insert(schema.courseNode).values(
					toCreate.map((n) => ({
						courseId,
						parentId: n.parentId,
						order: n.order,
						contentId: n.contentId,
					}))
				);
			}
		};

		const syncFlatCourseNodes = async (
			courseId: number,
			input: CourseNodeUpsert[]
		) => {
			console.log(input);
			// Identify which are new to be created
			const existing = await db
				.select()
				.from(schema.courseNode)
				.where(eq(schema.courseNode.courseId, courseId));

			const existingMap = new Map(existing.map((n) => [n.id, n]));
			const incomingMap = new Map(
				input.filter((n) => n.id).map((n) => [n.id!, n]) // this is to check against existing for deletions etc
			);

			const toDelete = existing.filter((n) => !incomingMap.has(n.id));
			const toCreate = input.filter((n) => !n.id);
			const toUpdate = input.filter((n) => {
				if (!n.id) return false;
				const old = existingMap.get(n.id);
				return (
					old &&
					(old.order !== n.order ||
						old.parentId !== n.parentId ||
						old.contentId !== n.contentId)
				);
			});
			console.log("exisiting map", existingMap);
			console.log("Incoming Map", incomingMap);
			console.log("toCreate", toCreate);
			console.log("toUpdate", toUpdate);
			console.log("toDelete", toDelete);

			// CREATE
			if (toCreate.length) {
				const inserted = await db
					.insert(schema.courseNode)
					.values(
						toCreate.map((n) => ({
							courseId,
							parentId: null, // update later
							order: n.order,
							contentId: n.contentId,
						}))
					)
					.returning({ id: schema.courseNode.id });

				// create a map of clientIds to newly created db ids
				// this is placed outside the conditional create block bc it needs to still work in update as empty object
				const clientIdToDbId: Record<string, number> = {};

				toCreate.forEach((n, i) => {
					clientIdToDbId[n.clientId] = inserted[i].id;
				});
				console.log("ClientIdToDbId", clientIdToDbId);

				// push each toCreate to toUpdate
				// this is because they will need parentId updating, but so may some pre-existing nodes
				toCreate.forEach((n) => toUpdate.push(n));

				console.log(
					"To Update list with added toCreates... toUpdate",
					toUpdate
				);

				// mutate the toUpdate array substituting ids and parentIds
				toUpdate.forEach((node) => {
					node.id = node.id ?? clientIdToDbId[node.clientId];
					node.parentId = node.clientParentId
						? clientIdToDbId[node.clientParentId]
						: node.parentId;
				});

				console.log(
					"Mutated update list with ids and parentIds added. toUpdate",
					toUpdate
				);

				// 	await trx
				// 		.update(courseNode)
				// 		.set({ parentId: parentDbId })
				// 		.where(eq(courseNode.id, dbId));
				// }
			}

			// Update records
			for (const n of toUpdate) {
				await db
					.update(schema.courseNode)
					.set({
						order: n.order,
						parentId: n.parentId,
						contentId: n.contentId,
					})
					.where(eq(schema.courseNode.id, n.id!));
			}

			// DELETE
			if (toDelete.length) {
				await db.delete(schema.courseNode).where(
					inArray(
						schema.courseNode.id,
						toDelete.map((n) => n.id)
					)
				);
			}
		};

		// const upsertNodeRecursive = async (
		// 	node: CourseTreeItemUpsert,
		// 	parentId: number | null,
		// 	courseId: number
		// ) => {
		// 	if (node.id) {
		// 		// Update
		// 		await db
		// 			.update(schema.courseNode)
		// 			.set({
		// 				order: node.order,
		// 				parentId,
		// 				contentId: node.contentId,
		// 			})
		// 			.where(eq(schema.courseNode.id, node.id));
		// 	} else {
		// 		// Create
		// 		const inserted = await db
		// 			.insert(schema.courseNode)
		// 			.values({
		// 				courseId,
		// 				parentId,
		// 				order: node.order,
		// 				contentId: node.contentId,
		// 			})
		// 			.returning({ id: schema.courseNode.id });

		// 		node.id = inserted[0].id; // so children can use it as parentId
		// 	}

		// 	if (node.children) {
		// 		for (const child of node.children) {
		// 			await upsertNodeRecursive(child, node.id, courseId);
		// 		}
		// 	}
		// };

		const list = async (): Promise<CourseDTO[]> => {
			const results = await db.select().from(schema.course);
			const parsed = courseDTO.array().safeParse(results);
			if (!parsed.success) {
				throw new Error("Invalid course data");
			}
			return parsed.data;
		};

		const get = async (id: number): Promise<CourseTreeDTO | null> => {
			const results = await db
				.select({
					course: schema.course,
					courseNode: schema.courseNode,
					contentItem: schema.contentItem,
				})
				.from(schema.course)
				.leftJoin(
					schema.courseNode,
					eq(schema.course.id, schema.courseNode.courseId)
				)
				.orderBy(schema.courseNode.order)
				.leftJoin(
					schema.contentItem,
					eq(schema.courseNode.contentId, schema.contentItem.id)
				)
				.where(eq(schema.course.id, id));

			if (results.length === 0) return null;

			const { course } = results[0];

			// Step 1: flatten nodes
			const flatItems = results
				.filter((r) => r.courseNode && r.contentItem)
				.map((r): CourseTreeItem => {
					const courseNode = r.courseNode!;
					const contentItem = r.contentItem!;
					return {
						id: courseNode.id,
						type: contentItem.type,
						title: contentItem.title,
						order: courseNode.order,
						contentId: courseNode.contentId,
						isPublished: contentItem.isPublished,
						clientId: "", // populate this if needed
						collapsed: false, // or from DB if stored
						children: [], // will be filled in next step
						parentId: courseNode.parentId ?? null,
					};
				});

			// Step 2: build tree
			const nodeMap = new Map<number, CourseTreeItem>();
			const roots: CourseTreeItem[] = [];

			for (const item of flatItems) {
				nodeMap.set(item.id, item);
			}

			for (const item of flatItems) {
				if (item.parentId && nodeMap.has(item.parentId)) {
					nodeMap.get(item.parentId)!.children.push(item);
				} else {
					roots.push(item);
				}
			}

			assignClientIds(roots);

			// Step 3: return CourseTree
			const courseTree: CourseTreeDTO = {
				...course,
				items: roots,
			};

			// Optional: validate
			courseTreeDTO.parse(courseTree);

			return courseTree;
		};

		const update = async (data: EditCourseTreeDTO) => {
			try {
				// 1. Update course info
				await db
					.update(schema.course)
					.set({
						title: data.title,
						excerpt: data.excerpt,
						isPublished: data.isPublished ?? false,
						updatedAt: new Date(),
					})
					.where(eq(schema.course.id, data.id));

				// 2. Sync course nodes
				await syncCourseTree(data.id, data.items);

				const course = await get(data.id);
				if (!course) {
					throw new Error("Failed to update course");
				}
				return course;
			} catch (error) {
				throw error;
			}
		};

		const destroy = async (courseId: number) => {
			// Step 1: Delete courseNodes
			await db
				.delete(schema.courseNode)
				.where(eq(schema.courseNode.courseId, courseId));

			// Step 2: Delete course
			await db
				.delete(schema.course)
				.where(eq(schema.course.id, courseId));
		};

		const create = async (
			data: CreateCourseTreeDTO
		): Promise<CourseTreeDTO> => {
			try {
				// Step 1: Insert course
				const [created] = await db
					.insert(schema.course)
					.values({
						userId: data.userId,
						title: data.title,
						excerpt: data.excerpt,
						isPublished: data.isPublished ?? false,
						createdAt: new Date(),
						updatedAt: new Date(),
					})
					.returning({ id: schema.course.id });

				const courseId = created.id;

				// Step 2: Sync tree (all inserts)
				await syncCourseTree(courseId, data.items);

				const course = await get(courseId);
				if (!course) {
					throw new Error("Failed to create course");
				}
				return course;
			} catch (error) {
				throw error;
			}
		};

		const createFlat = async (input: CreateCourseFlatNodesInput) => {
			// fail if input does not parse
			const parsedInput = createCourseFlatNodesInput.parse(input);

			const [created] = await db
				.insert(schema.course)
				.values({
					userId: input.userId,
					title: input.title,
					excerpt: input.excerpt,
					isPublished: input.isPublished ?? false,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning({ id: schema.course.id });

			const courseId = created.id;

			// Step 2: Sync the tree using clientId/clientParentId logic
			await syncFlatCourseNodes(courseId, input.nodes);
		};

		return {
			list,
			get,
			update,
			destroy,
			create,
			createFlat,
			syncFlatCourseNodes,
		};
	};

	const contentItemRepo = (db: DrizzleDatabase) => {
		const list = async ({ type }: { type?: ContentType } = {}): Promise<
			ContentItemDTO[]
		> => {
			const query = db.select().from(schema.contentItem);

			// Conditionally apply `.where()` only if type is defined
			const results = type
				? await query.where(eq(schema.contentItem.type, type))
				: await query;

			const parsed = contentItemDTO.array().safeParse(results);
			if (!parsed.success) {
				console.error(parsed.error.format()); // helpful for debugging
				throw new Error("Invalid content item data");
			}

			return parsed.data;
		};

		const get = async (id: number): Promise<FullContentItem | null> => {
			const base = await db
				.select()
				.from(schema.contentItem)
				.where(eq(schema.contentItem.id, id));

			if (!base[0]) return null;

			switch (base[0].type) {
				case "lesson": {
					const detail = await db
						.select()
						.from(schema.lessonDetail)
						.where(eq(schema.lessonDetail.contentId, base[0].id));
					if (!detail[0]) return null;
					return fullContentItem.parse({
						...base[0],
						details: detail[0],
					});
				}
				case "module": {
					return fullContentItem.parse({
						...base[0],
						details: {},
					});
				}
				case "file": {
					const detail = await db
						.select()
						.from(schema.fileDetail)
						.where(eq(schema.fileDetail.contentId, base[0].id));
					if (!detail[0]) return null;
					return fullContentItem.parse({
						...base[0],
						details: detail[0],
					});
				}
				case "quiz": {
					// TODO
					return fullContentItem.parse({
						...base[0],
						details: {},
					});
				}
				case "video": {
					const detail = await db
						.select()
						.from(schema.videoDetail)
						.where(eq(schema.videoDetail.contentId, base[0].id));
					if (!detail[0]) return null;
					return fullContentItem.parse({
						...base[0],
						details: detail[0],
					});
				}
				default:
					throw new Error(
						`Unsupported content type: ${base[0].type}`
					);
			}
		};

		const destroy = async (id: number) => {
			await db
				.delete(schema.contentItem)
				.where(eq(schema.contentItem.id, id));
		};

		const create = async (data: CreateFullContentItem) => {
			const base = {
				title: data.title,
				type: data.type,
				isPublished: data.isPublished,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// update main contentItem
			const [newContentItem] = await db
				.insert(schema.contentItem)
				.values(base)
				.returning();

			// spread details and add contentItem Id
			const detail = { ...data.details, contentId: newContentItem.id };

			switch (data.type) {
				case "lesson": {
					await db.insert(schema.lessonDetail).values(detail);
					break;
				}
				case "video": {
					await db.insert(schema.videoDetail).values(detail);
					break;
				}
				case "file": {
					await db.insert(schema.fileDetail).values(detail);
					break;
				}
				case "quiz": {
					console.error("Quiz creation not implemented yet");
					break;
				}
			}

			return await get(newContentItem.id);
		};

		const update = async (data: FullContentItem) => {
			const base = {
				id: data.id,
				title: data.title,
				type: data.type,
				isPublished: data.isPublished,
				updatedAt: new Date(),
			};

			const detail = data.details;

			await db
				.update(schema.contentItem)
				.set(base)
				.where(eq(schema.contentItem.id, data.id));

			switch (data.type) {
				case "lesson": {
					await db
						.update(schema.lessonDetail)
						.set(detail)
						.where(eq(schema.lessonDetail.contentId, data.id));
					break;
				}
				case "video": {
					await db
						.update(schema.videoDetail)
						.set(detail)
						.where(eq(schema.videoDetail.contentId, data.id));
					break;
				}
				case "file": {
					await db
						.update(schema.fileDetail)
						.set(detail)
						.where(eq(schema.fileDetail.contentId, data.id));
					break;
				}
				default: {
					console.log("data type not supported yet", data.type);
					break;
				}
			}

			return await get(base.id);
		};

		return {
			list,
			get,
			destroy,
			update,
			create,
		};
	};

	return {
		course: createCourseRepo(db),
		content: contentItemRepo(db),
	};
};

export const DrizzlePGAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = createSchema()
): DBAdapter => {
	return {
		...createCRUD(db, schema),
	};
};

export interface DBAdapter {
	course: CourseCRUD;
	content: ContentItemCRUD;
}

export const createCoursesDBAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = createSchema()
) => {
	return {
		adapter: DrizzlePGAdapter(db, schema),
		schema,
	};
};
