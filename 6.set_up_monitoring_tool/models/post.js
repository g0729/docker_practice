import { Sequelize } from "sequelize";

export default class Post extends Sequelize.Model {
	static initiate(sequelize) {
		Post.init(
			{
				title: {
					type: Sequelize.STRING(140),
					allowNull: false,
				},
				content: {
					type: Sequelize.STRING(200),
					allowNull: false,
				},
			},
			{
				sequelize,
				timestamps: true,
				underscored: false,
				paranoid: false,
				modelName: "Post",
				tableName: "posts",
				charset: "utf8mb4",
				collate: "utf8mb4_general_ci",
			}
		);
	}
	static associate(db) {}
}
