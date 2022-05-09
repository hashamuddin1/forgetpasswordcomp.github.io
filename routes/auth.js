const express = require("express");
const router = express.Router();
const { signup, resetpassword, forgetpassword } = require("../controllers/auth");

router.post('/signup', signup);
router.put('/forgetpassword', forgetpassword)
router.put('/resetpassword/:token', resetpassword)
module.exports = router;