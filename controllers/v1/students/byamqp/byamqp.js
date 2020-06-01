const amqp = require('amqplib/callback_api');
const AMQP_URL = 'amqp://localhost';

let ch = null;
let res_list = [];
amqp.connect(AMQP_URL, (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }
        ch = channel;
        ch.consume('find-student-by-id_res', (msg) => {
            console.log(JSON.parse(msg.content));
            result = JSON.parse(msg.content);
            res_list.push(result);
            console.log(res_list);
            return;
        }, {
            noAck: true
        });
    });
});

exports.getStudentById = async (req, res) => {
    const obj = JSON.stringify({ payload: req.params.studentId });
    console.log(obj);
    ch.sendToQueue('find-student-by-id', Buffer.from(obj), { persistent: true });
    while (res_list.length > 0) {        
        return res.status(200).send(res_list.shift());
    }
};

exports.createStudent = async (req, res) => {
    const obj = JSON
    ch.sendToQueue('create-student', Buffer.from(obj), { persistent: true });
    return res.status(204).send();
};