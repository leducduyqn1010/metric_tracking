const express = require('express');
const router = express.Router();
const Constants = require("../core/common/Constants");
const DistanceController = require('../controllers/distance.controller');

router.post(Constants.METRIC_TRACKING_API + Constants.DISTANCE_API, DistanceController.create.bind(DistanceController));
router.post(Constants.METRIC_TRACKING_API + Constants.DISTANCES_API, DistanceController.getAll.bind(DistanceController));
router.post(Constants.METRIC_TRACKING_API + Constants.DISTANCES_API + '/report', DistanceController.getReport.bind(DistanceController));
module.exports = router;