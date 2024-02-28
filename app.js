const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("./db");

async function run() {
	try {
		const dbName = "brotherMotos";
		const collectionName = "profile";

		const db = await connectToDatabase(dbName);

		const collection = db.collection(collectionName);

		const app = express();
		const port = process.env.PORT || 6060;

		app.use(cors());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.get("/", (req, res) => {
			res.send("Servidor Node.js funcionando!");
		});

		app.post(
			"/",
			[
				body("name").notEmpty(),
				body("email").notEmpty().isEmail(),
				body("password").notEmpty().isLength({ min: 6 })
			],
			async (req, res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					return res
						.status(400)
						.send(
							`Não foi possivel validar o email e/ou a senha ${errors}\n`
						);
				}

				const { name, email, password } = req.body;
				console.log(req.body);

				try {
					const insertResult = await collection.insertOne(req.body);
					res.send(
						`Usuário cadastrado e autenticado.\n Nome - ${name}, Email - ${email}, Senha - ${password}\n`
					);
				} catch (err) {
					console.log(err);
					res.status(500).send(
						`Something went wrong trying to insert the new documents: ${err}\n`
					);
				}
			}
		);

		app.get("/profile/:email", async (req, res) => {
			try {
				const reqEmail = req.params.email;
				const findOneQuery = { email: reqEmail };
				const findOneResult = await collection.findOne(findOneQuery);

				if (findOneResult === null) {
					console.log(
						`Couldn't find any person that contain ${reqEmail} as an email.\n`
					);
				} else {
					console.log(
						`Found a person with ${reqEmail} as an email:\n${JSON.stringify(
							findOneResult
						)}\n`
					);
					res.json(findOneResult);
				}
			} catch (error) {
				console.error(
					`Something went wrong trying to find one document: ${error}\n`
				);
				res.status(500).send("Erro interno do servidor");
			}
		});

		app.get("/profile", async (req, res) => {
			try {
				const findAllResult = await collection.find().toArray();

				if (findAllResult.length === 0) {
					console.log("No person found.\n");
				} else {
					console.log(
						`Found ${
							findAllResult.length
						} people:\n${JSON.stringify(findAllResult)}\n`
					);
				}
				res.json(findAllResult);
			} catch (error) {
				console.error(
					`Something went wrong trying to find all documents: ${error}\n`
				);
				res.status(500).send("Erro interno do servidor");
			}
		});

		app.listen(port, () => {
			console.log(`Servidor está rodando em http://localhost:${port}`);
		});
	} finally {
	}
}

run().catch(console.error);
