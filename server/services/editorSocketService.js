const logger = require('../modules/log');
const redisClient = require('../modules/redisClient');

const TIMEOUT_IN_SECONDS = 3600; // 1 hour

module.exports = function (io) {
    /** Redis can serve different applications and each app
     * has its own session
     */
    let sessionPath = '/temp_session';


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

        // if sessionId is not in collaborations, that means sessionId is not in memory
        if (!(sessionId in collaborations)) {
            // check in Redis
            redisClient.get(`${sessionPath}/${sessionId}`, (data) => {
                if (data) {
                    logger.info('Session was terminated previously; restore from redis');
                    collaborations[sessionId] = {
                        'cachedInstructions': JSON.parse(data), // to store changes under the same sessionId
                        'participants': []
                    }
                } else {
                    /* first time created new session or there was an expired old session 
                        anyway we need to create a new session
                    */
                    logger.info('Creating new session');
                    collaborations[sessionId] = {
                        'cachedInstructions': [],
                        'participants': []
                    }
                }
            });

            // add current partiticpant into participants
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            // if sessionId is in collaborations, just add current partiticpant into participants
            collaborations[sessionId]['participants'].push(socket.id);
            logger.debug('collaborations now is as: ' + JSON.stringify(collaborations)); //DEBUG
        }

        /**
         * socket event listener for 'change' event.
         * delta: the changed data, it records the row and column
         */
        socket.on('change', delta => {
            logger.debug('DEBUG: change socketId: ' + socketIdSessionId[socket.id] + ' ' + delta); //DEBUG

            // get sessionId based on socket.id
            let sessionId = socketIdSessionId[socket.id];

            if (sessionId in collaborations) {
                // store changes
                collaborations[sessionId]['cachedInstructions'].push(['change', delta, Date.now()]);

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

        /**
         * socket event listener for 'restoreBuffer' event.
         * delta: the changed data, it records the row and column
         */
        socket.on('restoreBuffer', delta => {
            // get sessionId based on socket.id
            let sessionId = socketIdSessionId[socket.id];

            logger.debug('DEBUG: restore for session: ' + sessionId + ', for socket: ' + socketIdSessionId[socket.id]); //DEBUG

            if (sessionId in collaborations) {
                // get history instructions under a session
                let instructions = collaborations[sessionId]['cachedInstructions'];

                // emit change event of the whole history changes to all participants under this session
                for (let i = 0; i < instructions.length; i++) {
                    /* instructions[i][0]: 'change'
                    instructions[i][1]: delta
                    instructions[i][2]: Date.now() */
                    socket.emit(instructions[i][0], instructions[i][1]);
                }
            } else {
                logger.info('No records of collaborations for this session');
            }
        });

        /**
         * socket event listener for 'disconnect' event.
         * disconnect happens when a participant closes its session
         */
        socket.on('disconnect', () => {
            let sessionId = socketIdSessionId[socket.id];
            logger.debug('DEBUG: disconnect for session: ' + sessionId + ', for socket: ' + socketIdSessionId[socket.id]); //DEBUG

            let foundAndRemoved = false;
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let index = participants.indexOf(socket.id);

                // if found then remove
                if (index >= 0) {
                    participants.splice(index, 1);
                    foundAndRemoved = true;

                    // if current participant is the last one
                    if (participants.length == 0) {
                        logger.info('Last participant of this session, commit this session to redis and rm it from memory');
                        let key = sessionPath + '/' + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);

                        // store into redis and remove this sessionId from memory
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
            }

            if (!foundAndRemoved) {
                // If code reaches here, debug it!
                logger.warn(`Warning: could not find this ${socket.id} in session ${sessionId}`)
            }
        })

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