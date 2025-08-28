import express from "express";
import db from "./models/index.js";
import Post from "./models/post.js";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestCounter = new client.Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests",
	labelNames: ["method", "route", "status_code"],
	registers: [register],
});

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.on("finish", () => {
		httpRequestCounter.inc({
			method: req.method,
			route: req.path,
			status_code: res.statusCode,
		});
	});

	next();
});

app.get("/metrics", async (req, res) => {
	res.set("Content-Type", register.contentType), res.end(await register.metrics());
});

if (process.env.NODE_ENV !== "test") {
	db.sequelize
		.sync({ force: false })
		.then(() => console.log("database connected"))
		.catch((err) => {
			console.error(err);
		});
}

app.get("/posts", async (req, res) => {
	try {
		const posts = await Post.findAll({
			order: [["createdAt", "DESC"]],
		});
		return res.json(posts);
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server Error");
	}
});

app.post("/posts", async (req, res) => {
	const { title, content } = req.body;
	try {
		const newPost = await Post.create({ title, content });
		return res.status(201).json(newPost);
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server Error");
	}
});

if (process.env.NODE_ENV !== "test") {
	app.listen(8080, () => {
		console.log("API 서버가 포트 8080에서 실행 중입니다.");
	});
}

export default app;
