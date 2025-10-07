import { db, pool } from "../config/db";
import { ideas } from "./schema";

async function run() {
	await db.delete(ideas); 
	await db.insert(ideas).values([
		{ title: "Dark mode", description: "Add dark theme to the app" },
		{ title: "Mobile app", description: "Ship minimal mobile companion" },
		{ title: "Offline mode", description: "Allow offline reading and queuing" },
		{ title: "Dark mode2", description: "Add dark theme to the app" },
		{ title: "Mobile app2", description: "Ship minimal mobile companion" },
		{ title: "Offline mode2", description: "Allow offline reading and queuing" },
		{ title: "Dark mode3", description: "Add dark theme to the app" },
		{ title: "Mobile app3", description: "Ship minimal mobile companion" },
		{ title: "Offline mode3", description: "Allow offline reading and queuing" },
		{ title: "Dark mode4", description: "Add dark theme to the app" },
		{ title: "Mobile app4", description: "Ship minimal mobile companion" },
		{ title: "Offline mode4", description: "Allow offline reading and queuing" },
	]);
}

run()
	.then(() => {
		console.log("Seed completed");
	})
	.catch((e) => {
		console.error(e);
		process.exitCode = 1;
	})
	.finally(async () => {
		await pool.end();
	});

