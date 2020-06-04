const amqp = require('amqplib/callback_api');
const isDocker = require('is-docker');
require('dotenv').config('./../../../../');

// Match with the rabbitmq container configuration
const AMQP_HOST = isDocker()
    ? process.env.DOCKER_RABBITMQ_HOST
    : 'localhost';
const AMQP_URL = `amqp://${AMQP_HOST}`;

const CREATE_STUDENT_QUEUE = 'create-student';
const CREATE_STUDENT_RES_QUEUE = 'create-student_res';
const FIND_STUDENT_BY_ID_QUEUE = 'find-student-by-id';
const FIND_STUDENT_BY_ID_RES_QUEUE = 'find-student-by-id_res';

exports.createNewStudent = (req, res) => {
    const obj = JSON.stringify({ payload: req.body.name });
    amqp.connect(AMQP_URL, (error, connection) => {
        if (error) {
            throw error;
        }

        connection.createChannel((error, channel) => {
            if (error) {
                res.status(400).send(error);
                throw error;
            }

            channel.assertQueue(CREATE_STUDENT_RES_QUEUE, {
                durable: true
            }, (error, res_queue) => {
                if (error) {
                    res.status(400).send(error);
                    throw error;
                }

                let correlationId = generateUUID();
                channel.consume(res_queue.queue, (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        const reply = JSON.parse(msg.content);
                        res.status(201).send(reply);
                        channel.ack(msg);

                        setTimeout(() => {
                            connection.close();
                        }, 500);
                        return;
                    } else {
                        channel.nack(msg);
                    }
                });

                channel.assertQueue(CREATE_STUDENT_QUEUE, {
                    durable: true
                }, (error, req_queue) => {
                    if (error) {
                        res.status(400).send(error);
                        throw error;
                    }
    
                    channel.sendToQueue(req_queue.queue, Buffer.from(obj), {
                        correlationId: correlationId,
                        replyTo: res_queue.queue
                    });
                });
            });
        });
    });
};

exports.getStudentById = (req, res) => {
    const obj = JSON.stringify({ payload: req.params.studentId });
    amqp.connect(AMQP_URL, (error, connection) => {
        if (error) {
            throw error;
        }

        connection.createChannel((error, channel) => {
            if (error) {
                res.status(400).send(error);
                throw error;
            }

            channel.assertQueue(FIND_STUDENT_BY_ID_RES_QUEUE, {
                durable: true
            }, (error, res_queue) => {
                if (error) {
                    res.status(400).send(error);
                    throw error;
                }

                let correlationId = generateUUID();
                channel.consume(res_queue.queue, (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        const reply = JSON.parse(msg.content);
                        res.status(200).send(reply);
                        channel.ack(msg);

                        setTimeout(() => {
                            connection.close();
                        }, 500);
                        return;
                    } else {
                        channel.nack(msg);
                    }
                });

                channel.assertQueue(FIND_STUDENT_BY_ID_QUEUE, {
                    durable: true
                }, (error, req_queue) => {
                    if (error) {
                        res.status(400).send(error);
                        throw error;
                    }
    
                    channel.sendToQueue(req_queue.queue, Buffer.from(obj), {
                        correlationId: correlationId,
                        replyTo: res_queue.queue
                    });
                });
            });
        });
    });
};

const generateUUID = () => {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
};