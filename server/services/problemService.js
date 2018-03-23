const logger = require('../log');

const ProblemModel = require('../models/problemModel');

/* Error messages */
const problemDuplicationError = 'Problem already exists!';


const getProblems = function() {
    /* async call to grab problems from DB so using Promise */
    return new Promise((resolve, reject) => {
        
        ProblemModel.find({}, function(err, problems) {
            if (err) {
                reject(err);
            } else {
                resolve(problems);
            }
        });
    });
};

const getProblem = function(targetId) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id:targetId}, function(err, problem) {
            if (err) {
                reject(err);
            } else {
                resolve(problem);
            }
        });
    });
}

const addProblem = function(newProblem) {
    return new Promise((resolve, reject) => {
        // check if newProblem is an already existing one
        ProblemModel.findOne({name: newProblem.name}, function(err, data) {
            if (err) {
                reject(err);
            } else if (data) {
                reject(problemDuplicationError);
            } else {
                //save newProblem to mongodb
                ProblemModel.count({}, function(err, len) {
                    newProblem.id = len + 1;
                    let mongoProblem = new ProblemModel(newProblem);
                    mongoProblem.save();
                    resolve(mongoProblem);
                })
            }
        });
    });
}

module.exports = {
    getProblems,
    getProblem,
    addProblem
}