// Prerequisites
const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
const Book = require("../models").Book;

const Op = Sequelize.Op;

// Index routing
router.get("/", (req, res) => {
	const offset = 0;
	const limit = 10;
	Book.findAndCountAll({
		offset,
		limit
	}).then((books) => {
		res.render("index", {books: books.rows, bookCount: books.count, offset});
	});
});


// Search routing redirect
router.post("/", (req, res) => {
	res.redirect(`/books/q/${req.body.search}/page/1`);
});

// Search with pagination routing
router.get("/q/:query/page/:page", (req, res) => {
	const query = req.params.query;
	let page = req.params.page;
	const offset = (page - 1) * 10;
	const limit = 10;
	if(!page) {
		page = 1;
	}

	Book.findAndCountAll({
		where: {
			[Op.or]: 
				[
					{title: {[Op.like]: `%${query}%`}},
					{author: {[Op.like]: `%${query}%`}},
					{genre: {[Op.like]: `%${query}%`}},
					{year: {[Op.like]: `%${query}%`}}
				]
		},
		offset,
		limit
	}).then((books) => {
		res.render("index", {books: books.rows, bookCount: books.count, query, offset});
	});
});

// Pagination routing
router.get("/page/:page", (req, res) => {
	const page = req.params.page;
	const offset = (page - 1) * 10;
	const limit = 10;
	Book.findAndCountAll({
		offset,
		limit
	}).then((books) => {
		res.render("index", {books: books.rows, bookCount: books.count, offset});
	});
});

// New book routing
router.get("/new", (req, res) => {
	res.render("new-book", {book: Book.build({
		title: "",
		author: "",
		genre: "",
		year: ""
	})});
});

// New book handler
router.post("/new", (req, res) => {
	Book.create(req.body).then(() => {
		res.redirect("/books");
	}).catch(error => {
		if(error.name === "SequelizeValidationError") {
			res.render("new-book", {
				book: Book.build(req.body),
				errors: error.errors
			});
		} else {
			throw error;
		}
	});
});

// Book update routing
router.get("/:id", (req, res) => {
	Book.findById(req.params.id).then((book) => {
		res.render("update-book", {book: book});
	});
});

// Book update handler
router.post("/:id", (req, res, next) => {
	Book.findById(req.params.id).then((book) => {
		return Book.update(req.body, {where: {id: req.params.id}});
	}).then(() => {
		res.redirect("/books");
	}).catch(error => {
		if(error.name === "SequelizeValidationError") {
			res.render("update-book", {
				book: Book.build(req.body),
				errors: error.errors
			});
		} else {
			throw error;
		}
	});
});

// Book delete handler
router.post("/:id/delete", (req, res) => {
	Book.findById(req.params.id).then((book) => {
		return book.destroy();
	}).then(() => {
		res.redirect("/books");
	});
});

module.exports = router;