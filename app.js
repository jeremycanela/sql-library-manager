// Prerequisites
const express = require("express");
const app = express();
const routes = require("./routes/index");
const books = require("./routes/book");
const bodyParser = require('body-parser');

app.set("view engine", "pug");

app.use("/static", express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Index routing
app.use("/", routes);

// Main site routing
app.use("/books", books);

// Catches 404 error
app.use((req, res, next) => {
	const err = new Error("Page not found");
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
	if(!err.status) {
		res.status(500);
		res.render("error");
	} else {
		res.status(err.status);
		res.render("page-not-found");
	}
});

app.listen(3000, () => {
	console.log("The application is running on localhost:3000");
});