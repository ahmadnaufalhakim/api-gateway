const axios = require('axios');

exports.createNewStudent = async (req, res) => {
    axios.post(`http://localhost:5000/api/v1/students/`, req.body)
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};

exports.getStudentById = async (req, res) => {
    axios.get(`http://localhost:5000/api/v1/students/${req.params.studentId}`)
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};
