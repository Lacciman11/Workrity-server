const Task = require('../models/taskSchema');

// 1. Get tasks by user ID
const getTasksByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ userId });

    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

// 2. Create a new task by user ID
const createTask = async (req, res) => {
  try {
    const { title, importance, description, date, completed } = req.body;
    const userId = req.params.userId;

    if (!title || !description || !date) {
      return res.status(400).json({ error: 'Title, description, and date are required' });
    }

    const newTask = new Task({
      userId,
      title,
      importance,
      description,
      date,
      completed
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// 3. Update a task by task ID
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedData = req.body;

    const task = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// 4. Delete a task by task ID
const deleteTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// 5. Delete all tasks by user ID
const deleteAllTasksByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await Task.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No tasks found for this user to delete' });
    }

    res.status(200).json({ message: 'All tasks deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete tasks' });
  }
};

module.exports = {
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTaskById,
  deleteAllTasksByUserId
};
