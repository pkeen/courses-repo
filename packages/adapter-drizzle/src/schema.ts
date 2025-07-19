import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import {
	pgTable,
	integer,
	pgSchema,
	text,
	varchar,
	boolean,
	pgEnum,
	index,
	serial,
	uuid,
	timestamp,
	PgEnum,
} from "drizzle-orm/pg-core";
import { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

export type DrizzleDatabase =
	| PgDatabase<PgQueryResultHKT, any>
	| NeonHttpDatabase;

export const courses = pgSchema("courses");

export const course = courses.table(
	"course",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull(), // references external foreign key from auth
		title: varchar("title", { length: 256 }).notNull(),
		excerpt: text("excerpt").notNull(),
		isPublished: boolean("is_published").notNull().default(false),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => ({
		userIdIdx: index("course_user_id_idx").on(table.userId),
	})
);

export const contentType = pgEnum("content_type", [
	"lesson",
	"quiz",
	"file",
	"module",
	"video",
]);

export const contentItem = courses.table("content_item", {
	id: serial("id").primaryKey(),
	type: contentType("type").notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	isPublished: boolean("is_published").notNull().default(false), // TODO: maybe lift this to course_node
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	// optional: current_version, etc.
});

// Hierarchy inside one course
export const courseNode = courses.table(
	"course_node",
	{
		id: serial("id").primaryKey(),
		courseId: integer("course_id").notNull(),
		parentId: integer("parent_id"), // self-ref
		order: integer("order").notNull(),

		contentId: integer("content_id")
			.references(() => contentItem.id, {
				onDelete: "cascade",
			})
			.notNull(),
	},
	(table) => ({
		courseParentIdx: index("course_parent_idx").on(
			table.courseId,
			table.parentId,
			table.order
		),
	})
);

export const videoProviderEnum = pgEnum("video_provider", [
	"r2",
	"youtube",
	"vimeo",
	"mux",
	"bunny",
]);

export const videoDetail = courses.table("video_detail", {
	id: serial("id").primaryKey(),
	contentId: integer("content_id")
		.references(() => contentItem.id, {
			onDelete: "cascade",
		})
		.notNull(),
	provider: videoProviderEnum("video_provider").notNull(),
	url: text("url").notNull(),
	thumbnailUrl: text("thumbnail_url").notNull(),
});

export const lessonDetail = courses.table("lesson_detail", {
	id: serial("id").primaryKey(),
	contentId: integer("content_id")
		.references(() => contentItem.id, {
			onDelete: "cascade",
		})
		.notNull(),
	videoContentId: integer("video_content_id").references(
		() => contentItem.id,
		{
			onDelete: "cascade",
		}
	),
	excerpt: text("excerpt"), // short summary for previews
	bodyContent: text("body_content"), // raw markdown or HTML
});

export const fileDetail = courses.table("file_detail", {
	id: serial("id").primaryKey(),
	contentId: integer("content_id")
		.references(() => contentItem.id, {
			onDelete: "cascade",
		})
		.notNull(),
	fileName: text("file_name").notNull(),
	fileUrl: text("file_url").notNull(),
	mimeType: text("mime_type").notNull(),
	size: integer("size").notNull(),
});

export const createSchema = () => {
	return {
		courses,
		course,
		contentItem,
		contentType,
		courseNode,
		lessonDetail,
		videoProviderEnum,
		videoDetail,
		fileDetail,
	};
};

// Flat table-only schema (only tables)
export const schemaTables = {
	course,
	contentItem,
	courseNode,
	lessonDetail,
	videoDetail,
};

export type SchemaTables = typeof schemaTables;

// Simulate the result of calling drizzle() with schema:
export type DrizzleDbWithSchema = ReturnType<typeof drizzle<SchemaTables>>;
export type DefaultSchema = ReturnType<typeof createSchema>;

// TODO: Work this out
/** Call this exactly once after you create the tables.
 *  After that the trigger lives in the database.
 */
// export async function initCourseSchema(db: DrizzleDatabase) {
// 	await db.execute(sql`
//     DO $$
//     BEGIN
//       /* install trigger func once per DB */
//       IF NOT EXISTS (
//         SELECT 1 FROM pg_proc WHERE proname = 'trg_course_node_no_cycles'
//       ) THEN

//         CREATE OR REPLACE FUNCTION trg_course_node_no_cycles()
//         RETURNS trigger LANGUAGE plpgsql AS $$
//         BEGIN`
//           /* root nodes are always fine */
//           IF NEW.parent_id IS NULL THEN
//             RETURN NEW;
//           END IF;

//           /* parent must belong to the same course */
//           IF NEW.course_id <> (
//                SELECT course_id FROM course_node WHERE id = NEW.parent_id
//              )
//           THEN
//             RAISE EXCEPTION USING
//               ERRCODE = '23514',          -- check_violation
//               MESSAGE = format(
//                 'Parent node % belongs to a different course', NEW.parent_id
//               );
//           END IF;

//           /* prevent cycles: is New.parent one of my descendants? */
//           IF EXISTS (
//             WITH RECURSIVE anc(id) AS (
//               SELECT NEW.parent_id
//               UNION ALL
//               SELECT parent_id
//               FROM course_node
//               WHERE id = anc.id
//                 AND parent_id IS NOT NULL
//             )
//             SELECT 1 FROM anc WHERE id = NEW.id
//           ) THEN
//             RAISE EXCEPTION USING
//               ERRCODE = '23514',
//               MESSAGE = 'Cycle detected: node cannot be its own ancestor';
//           END IF;

//           RETURN NEW;
//         END $$;

//         CREATE TRIGGER course_node_no_cycles
//         BEFORE INSERT OR UPDATE ON course_node
//         FOR EACH ROW EXECUTE FUNCTION trg_course_node_no_cycles();

//       END IF;
//     END $$;
//   `);
// }
// export async function initCourseSchema(db: DrizzleDatabase) {
// 	// ensure function exists
// 	await db.execute(sql`
//     CREATE OR REPLACE FUNCTION trg_course_node_no_cycles()
//     RETURNS trigger LANGUAGE plpgsql AS $$
//     BEGIN
//       IF NEW.parent_id IS NULL THEN
//         RETURN NEW;
//       END IF;

//       IF NEW.course_id <> (
//         SELECT course_id FROM courses.course_node WHERE id = NEW.parent_id
//       ) THEN
//         RAISE EXCEPTION 'Parent node belongs to another course';
//       END IF;

//       IF EXISTS (
//         WITH RECURSIVE anc(id) AS (
//           SELECT NEW.parent_id
//           UNION ALL
//           SELECT parent_id
//           FROM courses.course_node
//           JOIN anc ON cn.id = anc.id
//           WHERE cn.parent_id IS NOT NULL
//         )
//         SELECT 1 FROM anc WHERE id = NEW.id
//       ) THEN
//         RAISE EXCEPTION 'Cycle detected';
//       END IF;

//       RETURN NEW;
//     END;
//     $$;
//   `);

// 	// try to create trigger; swallow duplicate error
// 	try {
// 		await db.execute(sql`
//       CREATE TRIGGER course_node_no_cycles
//       BEFORE INSERT OR UPDATE ON courses.course_node
//       FOR EACH ROW EXECUTE FUNCTION trg_course_node_no_cycles();
//     `);
// 	} catch (e: any) {
// 		if (e.code !== "42710") throw e; // re-throw anything except “already exists”
// 	}
// }

// export const courseNodeNoCyclesTriggerSql = sql`
//   -- creates the function only if it does not exist
//   DO $$
//   BEGIN
//     IF NOT EXISTS (
//       SELECT 1 FROM pg_proc WHERE proname = 'trg_course_node_no_cycles'
//     ) THEN

//       CREATE OR REPLACE FUNCTION trg_course_node_no_cycles()
//       RETURNS trigger LANGUAGE plpgsql AS $f$
//       BEGIN
//         IF NEW.parent_id IS NULL THEN
//           RETURN NEW;
//         END IF;

//         /* same-course check */
//         IF NEW.course_id <> (
//           SELECT course_id FROM course_node WHERE id = NEW.parent_id
//         ) THEN
//           RAISE EXCEPTION
//             'Parent node % belongs to another course', NEW.parent_id;
//         END IF;

//         /* cycle check */
//         IF EXISTS (
//           WITH RECURSIVE anc(id) AS (
//             SELECT NEW.parent_id
//             UNION ALL
//             SELECT parent_id
//             FROM course_node
//             JOIN anc ON cn.id = anc.id
//             WHERE cn.parent_id IS NOT NULL
//           )
//           SELECT 1 FROM anc WHERE id = NEW.id
//         ) THEN
//           RAISE EXCEPTION 'Cycle detected';
//         END IF;

//         RETURN NEW;
//       END;
//       $f$;

//       CREATE TRIGGER course_node_no_cycles
//       BEFORE INSERT OR UPDATE ON course_node
//       FOR EACH ROW EXECUTE FUNCTION trg_course_node_no_cycles();
//     END IF;
//   END $$;
// `;

// export const courseNodeNoCyclesTriggerSqlString = `
//   DO $$
//   BEGIN
//     IF NOT EXISTS (
//       SELECT 1 FROM pg_proc WHERE proname = 'trg_course_node_no_cycles'
//     ) THEN

//       CREATE OR REPLACE FUNCTION trg_course_node_no_cycles()
//       RETURNS trigger LANGUAGE plpgsql AS $f$
//       BEGIN
//         IF NEW.parent_id IS NULL THEN
//           RETURN NEW;
//         END IF;

//         /* same-course check */
//         IF NEW.course_id <> (
//           SELECT course_id FROM course_node WHERE id = NEW.parent_id
//         ) THEN
//           RAISE EXCEPTION
//             'Parent node % belongs to another course', NEW.parent_id;
//         END IF;

//         /* cycle check */
//         IF EXISTS (
//           WITH RECURSIVE anc(id) AS (
//             SELECT NEW.parent_id
//             UNION ALL
//             SELECT parent_id
//             FROM course_node
//             JOIN anc ON cn.id = anc.id
//             WHERE cn.parent_id IS NOT NULL
//           )
//           SELECT 1 FROM anc WHERE id = NEW.id
//         ) THEN
//           RAISE EXCEPTION 'Cycle detected';
//         END IF;

//         RETURN NEW;
//       END;
//       $f$;

//       CREATE TRIGGER course_node_no_cycles
//       BEFORE INSERT OR UPDATE ON course_node
//       FOR EACH ROW EXECUTE FUNCTION trg_course_node_no_cycles();
//     END IF;
//   END $$;
// `;

// export const courseNodeNoCyclesTriggerDown = sql`
//   DROP TRIGGER IF EXISTS course_node_no_cycles ON course_node;
//   DROP FUNCTION IF EXISTS trg_course_node_no_cycles;
// `;
