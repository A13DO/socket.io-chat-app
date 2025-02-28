const express = require("express");
const router = express.Router();
const {users} = require("../controllers/users");






router.route("/")
    .get(users)


module.exports = router;