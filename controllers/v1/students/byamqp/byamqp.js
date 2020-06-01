const amqp = require('amqplib/callback_api');
const AMQP_URL = 'amqp://localhost';

let ch = null;
let create_student_res = [];
let find_student_res = [];
amqp.connect(AMQP_URL, (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }
        ch = channel;
        
        ch.consume('create-student_res', (msg) => {
            console.log(JSON.parse(msg.content));
            result = JSON.parse(msg.content);
            create_student_res.push(result);
            // console.log(create_student_res);
        }, {
            noAck: true
        });

        ch.consume('find-student-by-id_res', (msg) => {
            result = JSON.parse(msg.content);
            find_student_res.push(result);
            // console.log(find_student_res);
        }, {
            noAck: true
        });
    });
});

exports.createNewStudent = (req, res) => {
    const obj = JSON.stringify({ payload: req.body.name });
    ch.sendToQueue('create-student', Buffer.from(obj), { persistent: true });
    setTimeout(() => {
        while (create_student_res.length > 0) {
            return res.status(200).send(create_student_res.shift());
        }
    }, 250);
};

exports.getStudentById = (req, res) => {
    const obj = JSON.stringify({ payload: req.params.studentId });
    ch.sendToQueue('find-student-by-id', Buffer.from(obj), { persistent: true });
    setTimeout(() => {
        while (find_student_res.length > 0) {        
            return res.status(200).send(find_student_res.shift());
        }
    }, 250);
};