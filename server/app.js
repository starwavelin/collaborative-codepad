const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');

const logger = require('./log');
const restRouter = require('./routes/restRouter');
const socketIO = require('socket.io');
const io = socketIO();
const editorSocketServ = require('./services/editorSocketService')(io);

const dbConnString = fs.readFileSync('./configs/dbConn.txt', 'utf8');
mongoose.connect(dbConnString);


app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public')));


/**
 * Connect io with server
 */
const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening', () => logger.debug('Codepad started and listening on port 3000 '));



/* To solve the client-side and web server co-working issue 
    without the following, localhost:3000 can only supply problem list once and after user refresh, 
    user will have "Cannot GET /" issue
*/
app.use((req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});
