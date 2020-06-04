const isDocker = require('is-docker');
require('dotenv').config('./../../../../');
const axios = require('axios');

const HTTP_HOST = isDocker()
    ? process.env.DOCKER_HTTP_MICROSERVICE_HOST
    : 'localhost';
const HTTP_URL = `http://${HTTP_HOST}:5000/api/v1/students`;

exports.createNewStudent = async (req, res) => {
    // Match with the http-microservice container configuration
    axios.post(`${HTTP_URL}/`, req.body)
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};

exports.getStudentById = async (req, res) => {
    // Match with the http-microservice container configuration
    axios.get(`${HTTP_URL}/${req.params.studentId}`)
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};
