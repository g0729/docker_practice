import request from "supertest";
import app from "./app.js";
import db from "./models/index.js";

afterAll(() => {
	db.sequelize.close();
});

describe("Blog API Integration Test", () => {
	test("should get all posts", async () => {
		const response = await request(app).get("/posts");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	test("should create a new post", async () => {
		const newPost = {
			title: "Jest Integration Test",
			content: "This post is created by an integration test.",
		};
		const response = await request(app).post("/posts").send(newPost);
		expect(response.statusCode).toBe(201);
		expect(response.body.title).toBe("Jest Integration Test");
		expect(response.body).toHaveProperty("id");
	});
});
