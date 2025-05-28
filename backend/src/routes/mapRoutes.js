const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.get('/all', mapController.getAllMarkers);

module.exports = router;
