import { spawn } from "child_process";

function run(command: string, args: string[] = []): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: "inherit", // <-- live output!
			shell: true, // <-- allows using 'pnpm' directly
		});

		child.on("exit", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${command} exited with code ${code}`));
			}
		});
	});
}

async function main() {
	try {
		console.log("🔌 Starting DB...");
		await run("pnpm", ["db:start"]);

		console.log("⏳ Waiting for DB...");
		await run("pnpm", ["wait-for-db"]);

		console.log("🧪 Running tests...");
		await run("vitest", ["run"]);
	} catch (err) {
		console.error("❌ Error during test run:", err.message);
		process.exitCode = 1;
	} finally {
		console.log("🛑 Stopping DB...");
		await run("pnpm", ["db:stop"]).catch((err) =>
			console.warn("⚠️ Failed to stop DB:", err.message)
		);
	}
}

main();
