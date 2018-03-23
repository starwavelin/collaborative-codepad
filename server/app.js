const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');

const logger = require('./log');
const restRouter = require('./routes/restRouter');

const dbConnString = fs.readFileSync('./configs/dbConn.txt', 'utf8');
mongoose.connect(dbConnString);


app.use('/api/v1', restRouter);

app.listen(3000, () => logger.debug('Codepad started: '));
