const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

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
		body("email").notEmpty().isEmail(),
		body("password").notEmpty().isLength({ min: 6 })
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;
		console.log("Email:", email);
		console.log("Senha:", password);

		res.send(`Recebido: Email - ${email}, Senha - ${password}`);
	}
);

app.listen(port, () => {
	console.log(`Servidor está rodando em http://localhost:${port}`);
});
