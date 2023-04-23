const express = require('express');
const router = express.Router();
const Constants = require("../core/common/Constants");
const UserController = require('../controllers/user.controller');

router.post(Constants.METRIC_TRACKING_API + '/register', UserController.register.bind(UserController));
router.get(Constants.METRIC_TRACKING_API + '/users', UserController.allUser.bind(UserController));
module.exports = router;