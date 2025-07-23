import type { DB } from "../../db";
import { DefaultSchema } from "../../../src/schema";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";

const videoProviders = ["r2", "youtube", "vimeo", "mux", "bunny"];

// const getLessonIds = async (db: db) => {
// 	const lessonIds = db.select({ id: schema.lesson.id }).from(schema.lesson);
// 	return lessonIds;
// };

const videoContentIds = async (db: DB, schema: DefaultSchema) => {
	const videoContentIds = await db
		.select({ id: schema.contentItem.id })
		.from(schema.contentItem)
		.where(eq(schema.contentItem.type, "video"));
	return videoContentIds.map((videoContent: any) => videoContent.id);
};

const createVideoDetails = async (db: DB, schema: DefaultSchema) => {
	const contentIds = await videoContentIds(db, schema);
	const videoDetails = contentIds.map((contentId: number) => {
		return {
			provider: faker.helpers.arrayElement(
				schema.videoProviderEnum.enumValues
			),
			contentId,
			url: faker.internet.url(),
			thumbnailUrl: faker.image.urlPicsumPhotos({
				width: 640,
				height: 360,
			}),
			isPublished: faker.datatype.boolean(),
			// order: faker.number.int({ min: 1, max: 10 }),
			// durationSeconds: faker.number.int({ min: 60, max: 900 }),
		};
	});
	return videoDetails;
};

// const createDummyVideos = (count = 20) => {
// 	const videos = [];
// 	for (let i = 0; i < count; i++) {
// 		videos.push({
// 			provider: faker.helpers.arrayElement(videoProviders),
// 			url: faker.internet.url(),
// 			title: faker.lorem.sentence({ min: 3, max: 8 }),
// 			thumbnailUrl: faker.image.urlPicsumPhotos({
// 				width: 640,
// 				height: 360,
// 			}),
// 			isPublished: faker.datatype.boolean(),
// 			order: faker.number.int({ min: 1, max: 10 }),
// 			durationSeconds: faker.number.int({ min: 60, max: 900 }),
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		});
// 	}
// 	return videos;
// };

const seed = async (db: DB, schema: DefaultSchema) => {
	// const videoContentIds = await videoContentIds(db);
	const videos = await createVideoDetails(db, schema); // adjust number of records
	try {
		await db.insert(schema.videoDetail).values(videos);
		console.log("videos succesfully seeded...");
	} catch (error) {
		console.error("Error inserting videos:", error);
	}
};

export default seed;
