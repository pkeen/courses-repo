import type { DB } from "../../db";
import { createSchema, DefaultSchema } from "../../../src/schema";
import { faker } from "@faker-js/faker";
import type {
	CreateFullContentItem,
	ContentItemDTO,
} from "@pete_keen/courses-core/validators";

const seed = async (db: DB, schema: DefaultSchema) => {
	const spoofContentItemArray: Omit<ContentItemDTO, "id">[] = [];

	for (let i = 0; i < 60; i++) {
		const spoofContentItem = {
			type: faker.helpers.arrayElement(schema.contentType.enumValues), // 'cultivate synergistic e-markets'
			title: faker.company.buzzPhrase(), // 'cultivate synergistic e-markets'
			isPublished: faker.datatype.boolean(0.75),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		spoofContentItemArray.push(spoofContentItem);
	}

	try {
		await db.insert(schema.contentItem).values(spoofContentItemArray);
		console.log("content items succesfully seeded...");
	} catch (error) {
		console.error("Error inserting content items:", error);
	}
};

export default seed;
