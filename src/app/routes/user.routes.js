const express = require('express');
const router = express.Router();
const Constants = require("../core/common/Constants");
const UserController = require('../controllers/user.controller');

router.post(Constants.USER_API + Constants.REGISTER_API, UserController.register.bind(UserController));
router.get(Constants.USER_API, UserController.allUser.bind(UserController));
module.exports = router;