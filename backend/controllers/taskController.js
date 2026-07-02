const Task = require('../models/Task');

// Map mongo task schema to match frontend format
const mapTask = (t) => ({
  id: t._id,
  userId: t.userId,
  title: t.title,
  description: t.description,
  dueDate: t.dueDate,
  priority: t.priority,
  status: t.status,
  createdAt: t.createdAt
});

// Get all tasks for the logged-in student (with search, filter, sort, pagination)
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sortBy, page = 1, limit = 6 } = req.query;
    
    // Base filter
    const filter = { userId: req.userId };

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Sorting options
    let sortOption = { createdAt: -1 };
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOption = { [field]: order === 'desc' ? -1 : 1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalTasks = await Task.countDocuments(filter);
    const studentTasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      tasks: studentTasks.map(mapTask),
      totalPages: Math.ceil(totalTasks / limitNum),
      currentPage: pageNum,
      totalTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = await Task.create({
      userId: req.userId,
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      status: 'pending'
    });

    res.status(201).json(mapTask(newTask));
  } catch (error) {
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(mapTask(task));
  } catch (error) {
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
