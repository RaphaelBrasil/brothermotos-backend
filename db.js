const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.URI;
const client = new MongoClient(uri);

async function connectToDatabase(dbName) {
	try {
		await client.connect();
		console.log("Conectado ao banco de dados MongoDB!");
		return client.db(dbName);
	} catch (error) {
		console.error("Erro ao conectar ao banco de dados:", error.message);
		throw error;
	}
}

module.exports = connectToDatabase;
