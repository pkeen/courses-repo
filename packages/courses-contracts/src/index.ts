// @me/courses-contracts/src/service.ts
import type {
	CourseDTO,
	CourseGetNested,
	CourseCreateNestedInput,
	CourseUpdateNestedInput,
	FullContentItem,
	CreateFullContentItem,
	EditFullContentItem,
	ContentType,
	ContentItemDTO,
} from "@pete_keen/courses-core/entities"; // you already export this via zod

// TODO: Improve this service

export interface CourseService {
	list(): Promise<CourseDTO[]>;
	get(id: number): Promise<CourseGetNested | null>;
	destroy(id: number): Promise<void>;
	create: (data: CourseCreateNestedInput) => Promise<CourseGetNested>;
	update: (data: CourseUpdateNestedInput) => Promise<CourseGetNested>;
	// add create/update as you need for the UI
}

export interface ContentItemService {
	get: (id: number) => Promise<FullContentItem | null>;
	create: (data: CreateFullContentItem) => Promise<FullContentItem>;
	update: (data: EditFullContentItem) => Promise<FullContentItem>;
	destroy: (id: number) => Promise<void>;
	list: (options?: { type?: ContentType }) => Promise<ContentItemDTO[]>;
}

export interface CoursesService {
	course: CourseService;
	content: ContentItemService;
}
