import express from "express";
import { Pool } from "pg";

const app = express();
app.use(express.json());

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	host: "db",
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: 5432,
});

(async () => {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
		console.log('"posts" table checked/created successfully.');
	} catch (err) {
		console.error("Error creating table", err.stack);
	}
})();

app.get("/posts", async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

app.post("/posts", async (req, res) => {
	const { title, content } = req.body;
	try {
		const results = await pool.query("INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *", [
			title,
			content,
		]);
		res.status(201).json(results.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

app.listen(8080, () => {
	console.log("API 서버가 포트 8080에서 실행 중입니다.");
});
