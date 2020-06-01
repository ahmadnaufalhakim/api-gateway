const express = require('express')
const router = express.Router();
const httpController = require('./../../controllers/v1/students/byhttp/byhttp');

router.post('/v1/students/:studentId/byhttp', httpController.getStudentById);
router.post('/v1/students/byhttp', httpController.createNewStudent);

module.exports = router;