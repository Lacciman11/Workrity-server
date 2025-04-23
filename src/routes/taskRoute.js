const express = require('express');
const router = express.Router();

const {
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTaskById,
  deleteAllTasksByUserId
} = require('../controllers/taskController');

// Routes for task operations
router.get('/tasks/:userId', getTasksByUserId); 
router.post('/tasks/:userId', createTask); 
router.put('/tasks/:taskId', updateTask); 
router.delete('/tasks/:taskId', deleteTaskById); 
router.delete('/tasks/all/:userId', deleteAllTasksByUserId); 

module.exports = router;
