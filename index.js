const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Servidor Node.js funcionando!");
});

app.listen(port, () => {
	console.log(`Servidor está rodando em http://localhost:${port}`);
});
