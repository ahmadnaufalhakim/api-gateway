const express = require('express')
const router = express.Router();
const amqpController = require('./../../controllers/v1/students/byamqp/byamqp');

router.post('/v1/students/:studentId/byamqp', amqpController.getStudentById);
router.post('/v1/students/byamqp');

module.exports = router;