import {
	// CreateVideoDTO,
	// EditVideoDTO,
	CourseDTO,
	CourseTreeDTO,
	EditCourseTreeDTO,
	CourseNodeDTO,
	CreateCourseDTO,
	ContentType,
	ContentItemDTO,
	LessonDetail,
	VideoDetailDTO,
	CreateCourseTreeDTO,
	FullContentItem,
	EditFullContentItem,
	CreateFullContentItem,
	// CreateCourseFlatNodesInput,
	// EditCourseFlatNodesInput,
	GetCourseFlatOutput,
	// CourseNodeUpsert,
	GetCourseResponse,
	CourseGetNested,
	CourseCreateUnionInput,
	CourseUpdateUnionInput,
	CourseCreateInputFlat,
	CourseUpdateInputFlat,
	UpsertFlatNode,
} from "validators";

export {
	CourseNodeDTO,
	CourseDTO,
	CreateCourseDTO,
	ContentType,
	ContentItemDTO,
	LessonDetail,
	VideoDetailDTO,
	CourseTreeDTO,
};

/*
 * CRUD SHAPE FOR COURSE
 * maybe get should be the tree
 * update should be the update tree
 * list should be the basic courseDTO
 */

interface CRUDOperations<G, C, E, L> {
	get: (id: number) => Promise<G | null>;
	create: (data: C) => Promise<G>;
	update: (data: E) => Promise<G>;
	destroy: (id: number) => Promise<void>;
	list: () => Promise<L[]>;
}

export interface CourseCRUD
	extends CRUDOperations<
		CourseGetNested,
		CourseCreateUnionInput,
		CourseUpdateUnionInput,
		CourseDTO
	> {
	// ── overloaded get ─────────────────────────────────────────────
	/** original one-arg version -- keeps us compatible with the base */
	get(id: number): Promise<CourseGetNested | null>;
	get(
		id: number,
		opts: { structure: "flat" }
	): Promise<CourseGetNested | null>;
	get(
		id: number,
		opts: { structure: "nested" }
	): Promise<CourseGetNested | null>;

	// implementation signature (broadest ⇢ no compile error)
	get(
		id: number,
		opts: { structure: "flat" | "nested" }
	): Promise<GetCourseFlatOutput | GetCourseResponse | null>;
	createFlat: (input: CourseCreateInputFlat) => Promise<void>;
	updateFlat: (input: CourseUpdateInputFlat) => Promise<void>;
	// getFlat: (id: number) => Promise<GetCourseFlatOutput | null>;
	syncFlatCourseNodes: (
		courseId: number,
		input: UpsertFlatNode[]
	) => Promise<void>;
}
// export interface LessonCRUD
// 	extends CRUDOperations<LessonDetail, CreateLessonDTO, EditLessonDTO, LessonDetail> {
// 	findUsage: (id: number) => Promise<LessonUsage>;
// }

// export interface ContentItemCRUD
// 	extends CRUDOperations<
// 		FullContentItem,
// 		CreateFullContentItem,
// 		EditFullContentItem,
//         ContentItemDTO
// 	> {
//         list: (options: {type?: ContentType}) => Promise<ContentItemDTO[]>
//     }

export interface ContentItemCRUD {
	get: (id: number) => Promise<FullContentItem | null>;
	create: (data: CreateFullContentItem) => Promise<FullContentItem>;
	update: (data: EditFullContentItem) => Promise<FullContentItem>;
	destroy: (id: number) => Promise<void>;
	list: (options?: { type?: ContentType }) => Promise<ContentItemDTO[]>;
}

export interface ContentUsage {
	courseNodes: CourseNodeDTO[];
}

export interface DBAdapter {
	course: CourseCRUD;
	content: ContentItemCRUD;
	// module: ModuleCRUD;
	// lesson: LessonCRUD;
	// video: VideoCRUD;
}

// export {
// 	Lesson,
// 	UiModule,
// 	UiModuleSlot,
// 	Video,
// 	CreateVideoDTO,
// 	EditVideoDTO,
// } from "validators";
