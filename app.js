import express from "express";
import redis from "redis";

const app = express();
const client = redis.createClient({
	url: "redis://redis-db:6379",
});

client.on("error", (err) => {
	console.error("Redis Client Error", err);
});

(async () => {
	await client.connect();
	await client.set("visits", 0);
})();

app.get("/", async (req, res, next) => {
	const visits = await client.incr("visits");
	res.send(`웹사이트 방문 횟수 : ${visits}`);
});

app.listen(8080, () => {
	console.log("웹 서버가 8080 포트에서 시작되었습니다");
});
