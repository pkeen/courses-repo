import {
	// CreateVideoDTO,
	// EditVideoDTO,
	CourseDTO,
	CourseTreeDTO,
	EditCourseTreeDTO,
	CourseNodeDTO,
	CreateCourseNodeDTO,
	CreateCourseDTO,
	ContentType,
	ContentItemDTO,
	LessonDetail,
	VideoDetailDTO,
	CreateCourseTreeDTO,
	FullContentItem,
	EditFullContentItem,
	CreateFullContentItem,
	CreateCourseFlatNodesInput,
	EditCourseFlatNodesInput,
	GetCourseFlatOutput,
	CourseNodeUpsert,
	GetCourseNested,
	GetCourseResponse,
} from "validators";

export {
	CourseNodeDTO,
	CreateCourseNodeDTO,
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
		GetCourseNested,
		CreateCourseTreeDTO,
		EditCourseTreeDTO,
		CourseDTO
	> {
	// ── overloaded get ─────────────────────────────────────────────
	/** original one-arg version -- keeps us compatible with the base */
	get(id: number): Promise<GetCourseNested | null>;
	get(
		id: number,
		opts: { structure: "flat" }
	): Promise<GetCourseFlatOutput | null>;
	get(
		id: number,
		opts: { structure: "nested" }
	): Promise<GetCourseNested | null>;

	// implementation signature (broadest ⇢ no compile error)
	get(
		id: number,
		opts: { structure: "flat" | "nested" }
	): Promise<GetCourseFlatOutput | GetCourseResponse | null>;
	createFlat: (input: CreateCourseFlatNodesInput) => Promise<void>;
	updateFlat: (input: EditCourseFlatNodesInput) => Promise<void>;
	// getFlat: (id: number) => Promise<GetCourseFlatOutput | null>;
	syncFlatCourseNodes: (
		courseId: number,
		input: CourseNodeUpsert
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

// export {
// 	Lesson,
// 	UiModule,
// 	UiModuleSlot,
// 	Video,
// 	CreateVideoDTO,
// 	EditVideoDTO,
// } from "validators";
