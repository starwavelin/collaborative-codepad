const express = require('express');
const router = express.Router();

const logger = require('../log');
const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

/* Error Messages */
const duplicateProblemError = 'Problem name exists already!';

// Get all problems
router.get('/problems', function(req, res) {
    problemService.getProblems().then(problems => res.json(problems));
})


// Get a problem
router.get('/problems/:id', function(req, res) {
    problemService.getProblem(+req.params.id).then(problem => res.json(problem));
})

// Post a problem
router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
        .then(problem => res.json(problem),
            error => res.status(400).send(duplicateProblemError));
})

module.exports = router;