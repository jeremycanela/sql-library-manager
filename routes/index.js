// Prerequisites
const express = require("express");
const router = express.Router();

// Index redirect
router.get("/", (req, res) => {
	res.redirect("/books");
});

module.exports = router;