/**
 * redisClient.js
 * 
 * The default package of redis is not singleton while in this program,
 * I just need one instance of redis to do caching.
 * So, I created this util file
 */

const redis = require('redis');
const client = redis.createClient();
const logger = require('./log');

/* Create my own set and get wrapper function for redis */

function set(key, value, callback) {
    client.set(key, value, function(err, res) {
        if (err) {
            logger.error(err);
            return;
        }
        callback(res);
    });
}

function get(key, value, callback) {
    client.get(key, value, function(err, res) {
        if (err) {
            logger.error(err);
            return;
        }
        callback(res);
    });
}

function expire(key, timeInSeconds) {
    client.expire(key, timeInSeconds);
}

function quit() {
    client.quit();
}

module.exports =  {
    get,
    set,
    expire,
    quit,
    redisPrint: redis.print  // here directly export the print function in redis
}