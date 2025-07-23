import type { DB } from "../../db";
import { DefaultSchema } from "../../../src/schema";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";

const markdownSamples = [
	`# Introduction to Markdown\n\nMarkdown lets you write **bold**, *italic*, and even \`code\` easily.`,
	`## Lesson Video\n\n<video controls src="https://cdn.example.com/lesson1.mp4"></video>`,
	`### Image Embed\n\n![An image](https://placehold.co/600x400)`,
	`## Code Block\n\n\`\`\`js\nconst greet = () => console.log("Hello!");\n\`\`\``,
	`## List Example\n\n- Item 1\n- Item 2\n- Item 3`,
];

const getVideoIds = async (db: DB, schema: DefaultSchema) => {
	// const videos = await courses.content.list({ type: "video" });
	const videos = await db
		.select({ id: schema.contentItem.id })
		.from(schema.contentItem)
		.where(eq(schema.contentItem.type, "video"));
	return videos.map((video) => video.id);
};

const getLessonContentIds = async (db: DB, schema: DefaultSchema) => {
	// const contentItems = await courses.content.list({ type: "lesson" });
	const lessonItems = await db
		.select({ id: schema.contentItem.id })
		.from(schema.contentItem)
		.where(eq(schema.contentItem.type, "lesson"));
	return lessonItems.map((contentItem) => contentItem.id);
};

const seed = async (db: DB, schema: DefaultSchema) => {
	const videoIds = await getVideoIds(db, schema);
	if (videoIds.length === 0) {
		console.error("No videos found in the database.");
		process.exit(1);
	}
	const lessonContentIds = await getLessonContentIds(db, schema);
	if (lessonContentIds.length === 0) {
		console.error("No lesson content found in the database.");
		process.exit(1);
	}

	const spoofArray = lessonContentIds.map((lessonContentId) => {
		const bodyContent = `${faker.helpers.arrayElement(
			markdownSamples
		)}\n\n ${faker.lorem.paragraphs()}`;

		return {
			contentId: lessonContentId,
			videoContentId: faker.helpers.arrayElement(videoIds),
			excerpt: faker.lorem.sentences(),
			bodyContent,
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
		};
	});

	// for (let i = 0; i < 60; i++) {
	// 	const spoofData = {
	// 		contentId: Math.floor(Math.random() * 10) + 1,
	// 		videoId: faker.helpers.arrayElement(videoIds),
	// 	};
	// 	spoofArray.push(spoofData);
	// }

	try {
		await db.insert(schema.lessonDetail).values(spoofArray);
		console.log("lessons succesfully seeded...");
	} catch (error) {
		console.error("Error inserting lessons:", error);
	}
};

export default seed;
