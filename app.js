const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const connectToDatabase = require("./db");

async function run() {
	try {
		const dbName = "brotherMotos";
		const collectionProfilesName = "profiles";
		const collectionTasksName = "tasks";

		console.log(`Conectando ao banco de dados: ${dbName}`);
		const db = await connectToDatabase(dbName);

		const collectionProfiles = db.collection(collectionProfilesName);
		const collectionTasks = db.collection(collectionTasksName);

		const app = express();
		const port = process.env.PORT || 6060;

		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		app.use(cors());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.get("/", (req, res) => {
			return res.send("Servidor Node.js funcionando!");
		});

		const { body, validationResult } = require("express-validator");

		app.post(
			"/email",
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
							`Não foi possível validar o email e/ou a senha ${errors}\n`
						);
				}

				const { name, email, password } = req.body;

				const msg = {
					to: "raphaelbrasil7@gmail.com", // Change to your recipient
					from: "rt.raphael.oliveira@gmail.com", // Change to your verified sender
					subject: "Sending with SendGrid is Fun",
					text: `and easy to do anywhere, even with Node.js`,
					html: `<strong>and easy to do anywhere, even with Node.js. Here is the message :${req.body.email}</strong>`
				};

				sgMail
					.send(msg)
					.then(() => {
						console.log("Email sent");
						return res.send(`Email Eviado`);
					})
					.catch((error) => {
						console.error(error);
						return res
							.status(400)
							.send(
								`Não foi possível enviar o email: ${errors}\n`
							);
					});
			}
		);

		app.post(
			"/profiles",
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
							`Não foi possível validar o email e/ou a senha ${errors}\n`
						);
				}

				const { name, email, password } = req.body;

				try {
					const existingProfile = await collectionProfiles.findOne({
						email
					});

					if (existingProfile) {
						if (existingProfile.password === password) {
							return res.send({ email, name });
						} else {
							return res.status(400).send("Senha incorreta.\n");
						}
					}
					const insertResult = await collectionProfiles.insertOne(
						req.body
					);
					return res.send({ email, name });
				} catch (err) {
					console.log(err);
					return res
						.status(500)
						.send(
							`Something went wrong trying to insert the new documents: ${err}\n`
						);
				}
			}
		);

		app.get("/profiles", async (req, res) => {
			try {
				const findAllResult = await collectionProfiles.find().toArray();

				if (findAllResult.length === 0) {
					console.log("No person found.\n");
				} else {
					console.log(
						`Found ${
							findAllResult.length
						} people:\n${JSON.stringify(findAllResult)}\n`
					);
				}
				return res.json(findAllResult);
			} catch (error) {
				console.error(
					`Something went wrong trying to find all documents: ${error}\n`
				);
				return res.status(500).send("Erro interno do servidor");
			}
		});

		app.get("/profiles/:email", async (req, res) => {
			try {
				const reqEmail = req.params.email;
				const findOneQuery = { email: reqEmail };
				const findOneResult = await collectionProfiles.findOne(
					findOneQuery
				);
				console.log(reqEmail);
				if (findOneResult === null) {
					console.log(
						`Couldn't find any person that contain ${reqEmail} as an email.\n`
					);
					return res.status(500).send("Erro interno do servidor");
				} else {
					console.log(
						`Found a person with ${reqEmail} as an email:\n${JSON.stringify(
							findOneResult
						)}\n`
					);
					return res.json(findOneResult);
				}
			} catch (error) {
				console.error(
					`Something went wrong trying to find one document: ${error}\n`
				);
				return res.status(500).send("Erro interno do servidor");
			}
		});

		app.get("/tasks", async (req, res) => {
			try {
				const reqEmail = req.params.email;
				const findAllResult = await collectionTasks.find().toArray();
				return res.json(findAllResult);
			} catch (error) {
				console.error(`Erro ao buscar todas as tarefas: ${error}\n`);
				return res.status(500).send("Erro interno do servidor");
			}
		});

		app.get("/tasks/:email", async (req, res) => {
			try {
				const reqEmail = req.params.email;
				// Filtrar as tarefas pelo email fornecido
				const findAllResult = await collectionTasks
					.find({ user: reqEmail })
					.toArray();
				return res.json(findAllResult);
			} catch (error) {
				console.error(
					`Erro ao buscar tarefas para o email ${reqEmail}: ${error}\n`
				);
				return res.status(500).send("Erro interno do servidor");
			}
		});

		app.post("/tasks", async (req, res) => {
			const { _id, date, text, completed, user } = req.body;

			try {
				if (typeof _id === "string") {
					// Verifica se é um ID já existente em StringHex
					var objectId = ObjectId.createFromHexString(_id);
				} else if (typeof _id === "number") {
					// Verifica se é um ID em TimeStamp
					var objectId = ObjectId.createFromTime(_id);
				}
				const updateResult = await collectionTasks.updateOne(
					{ _id: objectId },
					{
						$set: {
							date: date,
							text: text,
							completed: completed,
							user: user
						}
					},
					{ upsert: true }
				);
				console.log(`ID: ${typeof _id}`);
				console.log(`ObjetoId: ${typeof objectId}`);
				console.log(
					`ObjetoId: ${objectId == "000000000000000000000000"}`
				);
				res.send({ updated: updateResult.modifiedCount });
			} catch (err) {
				console.log(err);
				res.status(500).send(
					`Something went wrong during the update: ${err}\n`
				);
			}
		});

		app.delete("/tasks/:id", async (req, res) => {
			const objectId = ObjectId.createFromHexString(req.params.id);
			console.log(req.params.id);
			console.log(objectId);
			try {
				// Convert string ID to ObjectId
				const deleteResult = await collectionTasks.deleteOne({
					_id: objectId
				});

				console.log(deleteResult);

				if (deleteResult.deletedCount === 0) {
					return res.status(404).send("Task não encontrada.\n");
				}

				res.send({ deleted: deleteResult.deletedCount });
			} catch (err) {
				console.log(err);
				res.status(500).send(
					`Something went wrong during the delete: ${err}\n`
				);
			}
		});

		app.listen(port, () => {
			console.log(`Servidor está rodando em http://localhost:${port}`);
		});
	} finally {
	}
}

run().catch(console.error);
