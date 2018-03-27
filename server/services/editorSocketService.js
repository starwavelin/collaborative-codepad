const logger = require('../log');

module.exports = function (io) {
    /** collaboration sessions: record all the participants in each session
     * so that server can send changes to all participants in a session
     */
    let collaborations = {};

    // map from socketId to sessionId
    let socketIdSessionId = {};

    io.on('connection', (socket) => {
        // get session Id
        let sessionId = socket.handshake.query['sessionId'];

        socketIdSessionId[socket.id] = sessionId;

        // if sessionId is not in collaborations, that means no one does this problem before
        if (!(sessionId in collaborations)) {
            collaborations[sessionId] = {
                'participants': []
            };
        }

        collaborations[sessionId]['participants'].push(socket.io);

        /**
         * socket event listener for 'change' event.
         * delta: the changed data, it records the row and column
         */
        socket.on('change', delta => {
            logger.debug('DEBUG: change socketId: ' + socketIdSessionId[socket.id] + ' ' + delta); //DEBUG

            // get sessionId based on socket.id
            let sessionId = socketIdSessionId[socket.id];

            if (sessionId in collaborations) {
                // get all participants on this session
                let participants = collaborations[sessionId]['participants'];

                // send changes to all participants
                for (let i = 0; i < participants.length; i++) {
                    // skip the participant who created this change
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit('change', delta);
                    }
                }
            } else {
                logger.info('NOT able to tie socket ID to any collaboration session');
            }
        });
    });

    
    
    
    
    /** Below is for the 'message' socket event for testing purpose */
    // // when connection event happens
    // io.on('connection', (socket) => {
    //     logger.debug(`socket is: ${socket}`);

    //     // get msg from client
    //     let msg = socket.handshake.query['message'];
    //     logger.debug(`message rec from client is: ${msg}`);

    //     // reply to socket id, emit a message from server (my) side
    //     io.to(socket.id).emit('message', 'Cool from server')
    // });
}