import { Table, getTableName, sql } from "drizzle-orm";
import type { DB } from "../db";
import type { SchemaTables, TablesArray } from "../../src/schema";

// // Reset tables
// export async function resetTable(db: db, table: Table) {
// 	return db.execute(
// 		sql.raw(
// 			`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`
// 		)
// 	);
// }

// Reset tables
export async function resetTable(db: DB, table: Table, schemaName?: string) {
	const tableName = getTableName(table);

	// Assuming getTableName returns just the table name (e.g., "course")
	// and the schema name is accessible via table.schemaName
	const fullyQualifiedTableName = `${schemaName}.${tableName}`;

	return db.execute(
		sql.raw(
			`TRUNCATE TABLE ${fullyQualifiedTableName} RESTART IDENTITY CASCADE`
		)
	);
}

export async function resetTables(db: DB, tables: TablesArray) {
	for (const table of tables) {
		await resetTable(db, table, "courses");
	}
}
