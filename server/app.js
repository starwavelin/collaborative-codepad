const express = require('express');
const app = express();
const logger = require('./log');
const restRouter = require('./routes/restRouter');

app.use('/api/v1', restRouter);

app.listen(3000, () => logger.debug('Codepad started'));
