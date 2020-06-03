const request = require('supertest');
const app = require('./../index');
const {performance} = require('perf_hooks');

describe('HTTP: POST /api/v1/students/byhttp', () => {
    it('should respond with json containing mariadb insert query information', (done) => {
        const startTime = performance.now();
        let i = 0;
        for (; i<100; i++) {
            request(app)
                .post('http://localhost:5002/api/v1/students/byhttp')
                .send({ name: 'http-' + (i+1).toString() })
                .set('Accept', 'application/json')
                .expect((res) => {
                    res.body.affectedRows = 1;
                    res.body.warningStatus = 0;
                })
                .expect(201);
        }
        const finishTime = performance.now();
        console.log(`100 POST requests to /api/v1/students/byhttp took ${(finishTime-startTime)} milliseconds.`);
        if (i === 100) done();
    });
});

describe('HTTP: POST /api/v1/students/:studentId/byhttp', () => {
    it('should respond with json containing the info of student with a certain registration number (1-100)', (done) => {
        const startTime = performance.now();
        let i = 0;
        for (; i<100; i++) {
            request(app)
                .post(`http://localhost:5002/api/v1/students/${i+1}/byhttp`)
                .set('Accept', 'application/json')
                .expect((res) => {
                    res.body.registration_number = i+1;
                })
                .expect(200);
        }
        const finishTime = performance.now();
        console.log(`100 POST requests to /api/v1/students/:studentId/byhttp took ${(finishTime-startTime)} milliseconds.`);
        if (i === 100) done();
    });
});

describe('AMQP: POST /api/v1/students/byamqp', () => {
    it('should respond with json containing mariadb insert query information', (done) => {
        const startTime = performance.now();
        let i = 0;
        for (; i<100; i++) {
            request(app)
                .post('http://localhost:5002/api/v1/students/byamqp')
                .send({ name: 'amqp-' + (i+1) })
                .set('Accept', 'application/json')
                .expect((res) => {
                    res.body.affectedRows = 1;
                    res.body.warningStatus = 0;
                })
                .expect(201);
        }
        const finishTime = performance.now();
        console.log(`100 POST requests to /api/v1/students/byamqp took ${(finishTime-startTime)} milliseconds.`);
        if (i === 100) done();
    });
});

describe('AMQP: POST /api/v1/students/:studentId/byamqp', () => {
    it('should respond with json containing the info of student with a certain registration number (101-200)', (done) => {
        const startTime = performance.now();
        let i = 100;
        for (; i<200; i++) {
            request(app)
                .post(`http://localhost:5002/api/v1/students/${i+1}/byamqp`)
                .set('Accept', 'application/json')
                .expect((res) => {
                    res.body.registration_number = i+1;
                })
                .expect(200);
        }
        const finishTime = performance.now();
        console.log(`100 POST requests to /api/v1/students/:studentId/byamqp took ${(finishTime-startTime)} milliseconds.`);
        if (i === 200) done();
    });
});
