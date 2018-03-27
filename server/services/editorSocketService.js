const logger = require('../log');

module.exports = function (io) {
    // when connection event happens
    io.on('connection', (socket) => {
        logger.debug(`socket is: ${socket}`);

        // get msg from client
        let msg = socket.handshake.query['message'];
        logger.debug(`message rec from client is: ${msg}`);

        // reply to socket id, emit a message from server (my) side
        io.to(socket.id).emit('message', 'Cool from server')
    });
}