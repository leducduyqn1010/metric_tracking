const express = require('express');
const router = express.Router();
const Constants = require("../core/common/Constants");
const TemperatureController = require('../controllers/temperature.controller');

router.post(Constants.METRIC_TRACKING_API + Constants.TEMPERATURE_API, TemperatureController.create.bind(TemperatureController));
router.post(Constants.METRIC_TRACKING_API + Constants.TEMPERATURES_API, TemperatureController.getAll.bind(TemperatureController));
router.post(Constants.METRIC_TRACKING_API + Constants.TEMPERATURES_API + '/report', TemperatureController.getReport.bind(TemperatureController));
module.exports = router;