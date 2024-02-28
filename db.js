const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.URI);

async function connectToDatabase() {
	try {
		await client.connect();
		console.log("Conectado ao banco de dados MongoDB!");
		return client.db();
	} catch (error) {
		console.error("Erro ao conectar ao banco de dados:", error.message);
		throw error;
	}
}

module.exports = connectToDatabase;
