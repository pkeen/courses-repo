import { db } from "./db";
import {
	DefaultSchema,
	createSchema,
	schemaTables,
	TablesArray,
	tablesArray,
} from "../src/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { beforeAll, beforeEach, it, expect, describe, afterAll } from "vitest";
import { resetTable, resetTables } from "./utils/resetTables";
import { DrizzlePGAdapter, createCoursesDBAdapter } from "../src/adapter";
import { seed } from "./utils/seed";
import { eq } from "drizzle-orm";
import {
	CreateFullContentItem,
	EditFullContentItem,
	fullContentItem,
	FullContentItem,
	courseDTO,
	courseTreeDTO,
	CourseTreeDTO,
	CreateCourseTreeDTO,
	createCourseTreeDTO,
	editCourseTreeDTO,
	EditCourseTreeDTO,
	CreateCourseFlatNodesInput,
	CourseNodeUpsert,
	CourseDTO,
	CreateCourseNodeDTO,
} from "@pete_keen/courses-core/validators";
import { afterEach } from "vitest";

// const schema = createSchema();
// const adapter = DrizzlePGAdapter(db)

const { adapter, schema } = createCoursesDBAdapter(db);

beforeAll(async () => {
	console.warn("running migrations");
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });
	console.log("✅ Migrations finished");

	// Seeding
	// await seed(db, schema);
});

beforeEach(async () => {
	await resetTables(db, tablesArray);
});

describe("Basic DB test", () => {
	it("inserts and reads back a content item", async () => {
		const newContent = await db
			.insert(schema.contentItem)
			.values({
				title: "Hello, world!",
				type: "lesson",
				isPublished: true,
				updatedAt: new Date(),
			})
			.returning();

		const results = await db
			.select()
			.from(schema.contentItem)
			.where(eq(schema.contentItem.title, "Hello, world!"));

		expect(results.length).toBe(1);
	});
});

// describe("Content Items CRUD", () => {
//     it("it inserts a module and reads it back")
// })

describe("contentItemRepo.list", () => {
	it("returns an empty array if no items exist", async () => {
		const result = await adapter.content.list();
		expect(result).toEqual([]);
	});

	it("returns all content items when no type filter is passed", async () => {
		await db.insert(schema.contentItem).values([
			{ title: "Lesson", type: "lesson", isPublished: true },
			{ title: "File", type: "file", isPublished: true },
		]);

		const result = await adapter.content.list();
		expect(result).toHaveLength(2);
	});

	it("filters content items by type", async () => {
		await db.insert(schema.contentItem).values([
			{ title: "Lesson", type: "lesson", isPublished: true },
			{ title: "File", type: "file", isPublished: true },
		]);

		const result = await adapter.content.list({ type: "lesson" });
		expect(result).toHaveLength(1);
		expect(result[0].type).toBe("lesson");
	});
});

describe("Module Content Item: create, edit, get, destroy", () => {
	it("creates a module and returns it", async () => {
		const newModule: CreateFullContentItem = {
			title: "Test Module",
			type: "module",
			isPublished: true,
			details: {},
		};

		const result = await adapter.content.create(newModule);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(newModule.title);
		expect(result.type).toBe(newModule.type);
		expect(result.isPublished).toBe(true);
		expect(result.id).toBeDefined();
	});

	it("updates an existing module and returns it", async () => {
		const newModule: CreateFullContentItem = {
			title: "Test Module",
			type: "module",
			isPublished: true,
			details: {},
		};

		const saved = await adapter.content.create(newModule);

		const updatedModule: EditFullContentItem = {
			...saved,
			title: "Updated Module",
		};
		const result = await adapter.content.update(updatedModule);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(updatedModule.title);
		expect(result.type).toBe(newModule.type);
		expect(result.isPublished).toBe(true);
		expect(+result.updatedAt).toBeGreaterThan(+saved.updatedAt);
	});
});

describe("Lesson Content Item: create, edit, get, destroy", () => {
	it("creates a lesson and returns it", async () => {
		const newLesson: CreateFullContentItem = {
			title: "Test Lesson",
			type: "lesson",
			isPublished: true,
			details: {
				excerpt: "Lorem ipsum...",
				bodyContent: "##Details of the body content",
			},
		};

		const result = await adapter.content.create(newLesson);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(newLesson.title);
		expect(result.type).toBe(newLesson.type);
		expect(result.isPublished).toBe(true);
		expect(result.id).toBeDefined();
		expect(result.details.contentId).toEqual(result.id);
	});

	it("updates an existing lesson and returns it", async () => {
		const newLesson: CreateFullContentItem = {
			title: "Test Lesson",
			type: "lesson",
			isPublished: true,
			details: {
				excerpt: "Lorem ipsum...",
				bodyContent: "##Details of the body content",
			},
			// createdAt: new Date(),
			// updatedAt: new Date(),
		};

		const saved = await adapter.content.create(newLesson);

		const updatedLesson: EditFullContentItem = {
			...saved,
			title: "Updated Lesson",
			details: {
				...saved.details,
				excerpt: "Edited excerpt",
			},
		};
		const result = await adapter.content.update(updatedLesson);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(updatedLesson.title);
		expect(result.type).toBe(newLesson.type);
		expect(result.isPublished).toBe(newLesson.isPublished);
		expect(result.details.contentId).toEqual(result.id);
		expect(result.details.excerpt).toBe(updatedLesson.details.excerpt);

		expect(+result.updatedAt).toBeGreaterThan(+saved.updatedAt);
	});
});

describe("Video Content Item: create, edit, get, destroy", () => {
	it("creates a video and returns it", async () => {
		const newVideo: CreateFullContentItem = {
			title: "Test Video",
			type: "video",
			isPublished: true,
			details: {
				provider: "youtube",
				url: "somelink.com",
				thumbnailUrl: "thumbnail.com",
			},
		};

		const result = await adapter.content.create(newVideo);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(newVideo.title);
		expect(result.type).toBe(newVideo.type);
		expect(result.isPublished).toBe(true);
		expect(result.id).toBeDefined();
		expect(result.details.contentId).toEqual(result.id);
	});

	it("updates an existing video and returns it", async () => {
		const newVideo: CreateFullContentItem = {
			title: "Test Video",
			type: "video",
			isPublished: true,
			details: {
				provider: "youtube",
				url: "somelink.com",
				thumbnailUrl: "thumbnail.com",
			},
		};

		const saved = await adapter.content.create(newVideo);

		const updatedVideo: EditFullContentItem = {
			...saved,
			title: "Updated Video",
			details: {
				...saved.details,
				url: "differntUrl.com",
			},
		};
		const result = await adapter.content.update(updatedVideo);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(updatedVideo.title);
		expect(result.type).toBe(newVideo.type);
		expect(result.isPublished).toBe(newVideo.isPublished);
		expect(result.details.contentId).toEqual(result.id);
		expect(result.details.url).toBe(updatedVideo.details.url);
		expect(result.details.thumbnailUrl).toBe(newVideo.details.thumbnailUrl);

		expect(+result.updatedAt).toBeGreaterThan(+saved.updatedAt);
	});
});

describe("File Content Item: create, edit, get, destroy", () => {
	it("creates a file and returns it", async () => {
		const newFile: CreateFullContentItem = {
			title: "Test File",
			type: "file",
			isPublished: true,
			details: {
				fileName: "test-file.pdf",
				fileUrl: "somelink.com/link",
				mimeType: "application/pdf",
				size: 1111,
			},
		};

		const result = await adapter.content.create(newFile);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(newFile.title);
		expect(result.type).toBe(newFile.type);
		expect(result.isPublished).toBe(true);
		expect(result.id).toBeDefined();
		expect(result.details.contentId).toEqual(result.id);
	});

	it("updates an file lesson and returns it", async () => {
		const newFile: CreateFullContentItem = {
			title: "Test File",
			type: "file",
			isPublished: true,
			details: {
				fileName: "test-file.pdf",
				fileUrl: "somelink.com/link",
				mimeType: "application/pdf",
				size: 1111,
			},
		};

		const saved = await adapter.content.create(newFile);

		const updatedFile: EditFullContentItem = {
			...saved,
			title: "Updated File",
			details: {
				...saved.details,
				fileUrl: "differntUrl.com",
			},
		};
		const result = await adapter.content.update(updatedFile);

		const parsed = fullContentItem.safeParse(result);
		expect(parsed.success).toBe(true);

		expect(result.title).toBe(updatedFile.title);
		expect(result.type).toBe(newFile.type);
		expect(result.isPublished).toBe(newFile.isPublished);
		expect(result.details.contentId).toEqual(result.id);
		expect(result.details.fileName).toBe(newFile.details.fileName);
		expect(result.details.fileUrl).toBe(updatedFile.details.fileUrl);

		expect(+result.updatedAt).toBeGreaterThan(+saved.updatedAt);
	});
});

/*
 * COURSES
 */

describe("Courses List Function", () => {
	beforeEach(async () => {
		await seed(db, schema);
	});

	afterEach(async () => {
		await resetTables(db, tablesArray);
	});

	it("returns an empty array if no items exist", async () => {
		await resetTables(db, tablesArray);
		const result = await adapter.course.list();
		expect(result).toEqual([]);
	});

	it("succesfully retrieves all 20 seeded courses", async () => {
		const results = await adapter.course.list();
		const parsed = courseDTO.array().safeParse(results);
		expect(parsed.success).toBe(true);
		expect(results.length).toEqual(20);
	});
});

// describe("Courses: CRUD", () => {
// 	beforeEach(async () => {
// 		await seed(db, schema);
// 	});

// 	afterEach(async () => {
// 		await resetTables(db, tablesArray);
// 	});

// 	it("creates a full course and returns it equally", async () => {
// 		const data: CreateCourseTreeDTO = {
// 			title: "New Course Test",
// 			userId: "test-user",
// 			excerpt: "Lorem Ipsum....",
// 			isPublished: true,
// 			items: [
// 				// {
// 				// 	order: 0,
// 				// 	contentId: 1,
// 				// 	parentId: null,
// 				// 	children: [
// 				//         {order: 0, contentId: 3, parentId}
// 				//     ],
// 				// },
// 				// {
// 				// 	order: 1,
// 				// 	contentId: 2,
// 				// 	parentId: null,
// 				// 	children: [],
// 				// },
// 			],
// 		};

// 		const result = await adapter.course.create(data);

// 		const parsed = courseTreeDTO.safeParse(result);
// 		expect(parsed.success).toBe(true);

// 		expect(result.children[0].type).toBe("lesson");
// 	});
// });

describe("Courses Flat Test", () => {
	it("Fails if input does not parse", async () => {
		const input = {
			title: "Test",
			userId: "asdfsdfkj",
			excerpt: "asdfasdfksdjfklasdjfldsf",
			nodes: 1678, // should be array
		};

		await expect(adapter.course.createFlat(input)).rejects.toThrowError();
	});

	// it("TESTING syncFlatCourseNodes", async () => {
	//     const input: CourseNodeUpsert = {
	//         courseId: 1,

	//     }
	// })
});

describe("Coursees Flat testing", () => {
	const existingCourse: Omit<CourseDTO, "id"> = {
		userId: "asd",
		title: "Test Course",
		excerpt: "lorem ipsum...",
	};

	const existingNodes: CreateCourseNodeDTO[] = [
		{
			courseId: 1,
			order: 0,
			parentId: null,
			contentId: 1,
		},
		{
			courseId: 1,
			order: 1,
			parentId: null,
			contentId: 2,
		},
		{
			// to be deleted
			courseId: 1,
			order: 2,
			parentId: null,
			contentId: 1,
		},
	];

	const input: CourseNodeUpsert[] = [
		{
			// New node
			courseId: 1,
			order: 1,
			parentId: null,
			contentId: 1,
			clientId: "cat",
		},
		{
			// 2nd New node - child of new node
			courseId: 1,
			order: 0,
			parentId: null,
			contentId: 2,
			clientId: "kitten",
			clientParentId: "cat",
		},
		{
			// Existing node - updated to be under new node
			id: 1,
			courseId: 1,
			order: 1,
			parentId: null,
			contentId: 1,
			clientId: "duckling",
			clientParentId: "cat",
		},
		{
			// existing node - reordered
			id: 2,
			courseId: 1,
			order: 0,
			parentId: null,
			contentId: 2,
			clientId: "pig",
		},
		// and one is missing meaning it must be deleted
	];
	beforeEach(async () => {
		// some content items
		await db.insert(schema.contentItem).values([
			{ title: "Lesson", type: "lesson", isPublished: true },
			{ title: "File", type: "file", isPublished: true },
		]);
		// a course
		await db.insert(schema.course).values(existingCourse);
		// some existing course nodes
		await db.insert(schema.courseNode).values(existingNodes);

		// run the new function
		await adapter.course.syncFlatCourseNodes(1, input);
	});

	afterEach(async () => {
		await resetTables(db, tablesArray);
	});

	it("creates new nodes", async () => {
		const nodes = await db.select().from(schema.courseNode);
		expect(nodes.length).toEqual(4);
	});

	it("updates an existing nodes parentId that is to be nested under a new node", async () => {
		const [node] = await db
			.select()
			.from(schema.courseNode)
			.where(eq(schema.courseNode.id, 1));
		expect(node.parentId).toBe(4);
	});

	it("updates an existing node - regular", async () => {
		const [node] = await db
			.select()
			.from(schema.courseNode)
			.where(eq(schema.courseNode.id, 2));
		expect(node.order).toBe(0);
	});

	it("deletes a node", async () => {
		const nodes = await db
			.select()
			.from(schema.courseNode)
			.where(eq(schema.courseNode.id, 3));
		expect(nodes.length).toEqual(0);
	});
});

// it("can insert content", async () => {
// 	await db.insert(schema.contentItem).values({
// 		title: "Test",
// 		type: "lesson",
// 		isPublished: true,
// 		updatedAt: new Date(),
// 	});
// 	const results = await db.select().from(schema.contentItem);
// 	expect(results.length).toBe(1);
// });
