import fs from "fs";
import Sequelize from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import Config from "../config/config.json" with {type : "json"}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";
const config = Config[env];

const sequelize = new Sequelize(config.database,config.username,config.password,config);


const db = {};
db.sequelize=sequelize;

const files =fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file !== basename &&
			file.slice(-3) == ".js" &&
			!file.startsWith(".")
		);
	});

for(const file of files){
	const {default : model} = await import(path.join(__dirname,file));
	db[model.name]=model;
	model.initiate(sequelize);
}

Object.keys(db).forEach(modelName=>{
	if(db[modelName].associate){
		db[modelName].associate(db);
	}
})
export default db;