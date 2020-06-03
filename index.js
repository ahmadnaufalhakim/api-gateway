const express = require('express');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const amqpRouter = require('./routes/byamqp/byamqp');
const httpRouter = require('./routes/byhttp/byhttp');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api', amqpRouter);
app.use('/api', httpRouter);

const port = process.env.PORT || 5002;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

module.exports = app;