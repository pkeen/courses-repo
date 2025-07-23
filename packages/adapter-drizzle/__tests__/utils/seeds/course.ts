import type { DB } from "../../db";
import { DefaultSchema } from "../../../src/schema";
import { faker } from "@faker-js/faker";
import type { CourseDTO } from "@pete_keen/courses-core/validators";

const markdownSamples = [
	`# Welcome to the Course

This is an introductory lesson to get you started.

- Learn what to expect
- Meet your instructor
- Set your goals

> "The journey of a thousand miles begins with a single step." – Lao Tzu
`,

	`## Embedding Images

Images help visualize ideas.

![Diagram](https://placehold.co/600x400?text=Sample+Diagram)

Make sure you understand how this applies to your project.
`,

	`### Lesson Video

Here's a walkthrough video explaining the key concepts:

<video controls src="https://cdn.example.com/video1.mp4" width="100%"></video>

Make sure to watch this before moving on.
`,

	`## Code Example

Let’s look at a basic function in JavaScript:

\`\`\`js
function add(a, b) {
  return a + b;
}
\`\`\`

This function takes two numbers and returns their sum.
`,

	`# Project Checklist

Before proceeding, make sure you have:

- Installed Node.js
- Initialized your project folder
- Run \`npm install\`

✅ You're ready to go!
`,

	`# Frequently Asked Questions

**Q: Do I need prior experience?**

A: No, this course is beginner-friendly.

**Q: How long is the course?**

A: It’s self-paced and you can finish in 2–4 weeks depending on your schedule.
`,

	`## Side-by-Side Comparison

| Feature      | Free Version | Premium Version |
|--------------|--------------|-----------------|
| Access       | Limited      | Full            |
| Support      | Community    | 24/7 Priority   |
| Certificates | ❌            | ✅               |
`,

	`# Motivational Quote

> "Success is not final, failure is not fatal: It is the courage to continue that counts." – Winston Churchill

Keep learning and stay consistent.
`,

	`## Quiz Time!

1. What is the output of \`console.log(typeof null)\`?
2. How would you center a div using Flexbox?
3. Name one benefit of functional programming.

Answer in your own words before moving on.
`,

	`## Thank You

You’ve completed the lesson. 🎉

Next up: [Advanced Topics →](#)

Remember: you can revisit this content anytime.
`,
];

const seed = async (db: DB, schema: DefaultSchema) => {
	const spoofCourseArray: Omit<CourseDTO, "id">[] = [];

	for (let i = 0; i < 20; i++) {
		const spoofCourse = {
			userId: faker.string.uuid(),
			title: faker.company.buzzPhrase(), // 'cultivate synergistic e-markets'
			excerpt: faker.lorem.sentences(),
			isPublished: faker.datatype.boolean(0.75),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		spoofCourseArray.push(spoofCourse);
	}

	try {
		await db.insert(schema.course).values(spoofCourseArray);
		console.log("courses succesfully seeded...");
	} catch (error) {
		console.error("Error inserting courses:", error);
	}
};

export default seed;
