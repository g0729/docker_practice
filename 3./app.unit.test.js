import request from "supertest";
import { afterAll, jest } from "@jest/globals";
import db from "./models/index.js";

const findAllMock = jest.spyOn(db.Post, "findAll");

const { default: app } = await import("./app.js");

describe("Blog API Unit Test with Sequelize", () => {
	afterEach(() => {
		findAllMock.mockClear();
	});

	test("GET /posts -> should return all posts", async () => {
		const mockPosts = [
			{ id: 1, title: "Mock Post 1", content: "Content 1", createdAt: new Date(), updatedAt: new Date() },
			{ id: 2, title: "Mock Post 2", content: "Content 2", createdAt: new Date(), updatedAt: new Date() },
		];

		findAllMock.mockResolvedValue(mockPosts);

		const response = await request(app).get("/posts");

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(JSON.parse(JSON.stringify(mockPosts)));
		expect(findAllMock).toHaveBeenCalledTimes(1);
	});
});

afterAll(async () => {
	await db.sequelize.close();
});
