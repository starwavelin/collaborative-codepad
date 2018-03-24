const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const logger = require('./log');
const restRouter = require('./routes/restRouter');

const dbConnString = fs.readFileSync('./configs/dbConn.txt', 'utf8');
mongoose.connect(dbConnString);


app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, () => logger.debug('Codepad started: '));

/* To solve the client-side and web server co-working issue 
    without the following, localhost:3000 can only supply problem list once and after user refresh, 
    user will have "Cannot GET /" issue
*/
app.use((req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});
