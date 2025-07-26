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
		CourseTreeDTO,
		CreateCourseTreeDTO,
		EditCourseTreeDTO,
		CourseDTO
	> {
	createFlat: (input: CreateCourseFlatNodesInput) => Promise<void>;
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
