const axios = require('axios');

exports.createNewStudent = async (req, res) => {
    // Match with the http-microservice container configuration
    axios.post(`http://http-microservice:5000/api/v1/students/`, req.body)
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            console.log('err');
            res.status(400).send(error);
        });
};

exports.getStudentById = async (req, res) => {
    // Match with the http-microservice container configuration
    axios.get(`http://http-microservice:5000/api/v1/students/${req.params.studentId}`)
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};
