const { MongoClient } = require("mongodb");

const uri =
	"mongodb+srv://rtraphaeloliveira:C5oXCh7uppZydLya@clusterbrother.wvghvcp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

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