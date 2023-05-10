const express = require('express');
const router = express.Router();

const { isAuth, generateSendJWT, isAdmin } = require('../services/auth');

const ProjectController = require('../controllers/adminProject');

router.post('/', isAdmin, ProjectController.handleCreateProject);

//teams
router.get('/:projId/team/:teamId', isAdmin, ProjectController.handleReadTeam);

module.exports = router;
