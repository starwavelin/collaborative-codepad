const express = require('express');
const app = express();
const logger = require('./log');

app.get('/', (req, res) => {res.send('Hello Express!')});
app.listen(3000, () => logger.debug('Example app'));
