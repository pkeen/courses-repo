import {
	CourseDTO,
	CourseNodeDTO,
	ContentType,
	ContentItemDTO,
	FullContentItem,
	EditFullContentItem,
	CreateFullContentItem,
	GetCourseFlatOutput,
	GetCourseResponse,
	CourseGetNested,
	CourseCreateUnionInput,
	CourseUpdateUnionInput,
	CourseCreateInputFlat,
	CourseUpdateInputFlat,
	UpsertFlatNode,
} from "validators";

interface CRUDOperations<G, C, E, L> {
	get: (id: number) => Promise<G | null>;
	create: (data: C) => Promise<G>;
	update: (data: E) => Promise<G>;
	destroy: (id: number) => Promise<void>;
	list: () => Promise<L[]>;
}

export interface CourseRepo
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
export interface ContentItemRepo {
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
	course: CourseRepo;
	content: ContentItemRepo;
}
