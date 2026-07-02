const { tasks } = require('../config/mockDb');

// Get all tasks for the logged-in student (with search, filter, sort)
const getTasks = (req, res) => {
  try {
    let studentTasks = tasks.filter(t => t.userId === req.userId);

    const { search, status, priority, sortBy } = req.query;

    // Search by title or description
    if (search) {
      const query = search.toLowerCase();
      studentTasks = studentTasks.filter(
        t => t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (status) {
      studentTasks = studentTasks.filter(t => t.status === status);
    }

    // Filter by priority
    if (priority) {
      studentTasks = studentTasks.filter(t => t.priority === priority);
    }

    // Sort
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      studentTasks.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'dueDate' || field === 'createdAt') {
          valA = new Date(valA || 0);
          valB = new Date(valB || 0);
        }

        if (valA < valB) return order === 'desc' ? 1 : -1;
        if (valA > valB) return order === 'desc' ? -1 : 1;
        return 0;
      });
    } else {
      // Default: newest tasks first
      studentTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(studentTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// Create a new task
const createTask = (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = {
      id: Date.now().toString(),
      userId: req.userId,
      title,
      description: description || '',
      dueDate: dueDate || '',
      priority: priority || 'medium',
      status: 'pending',
      createdAt: new Date()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Update a task
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === id && t.userId === req.userId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      title: title !== undefined ? title : tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
      priority: priority !== undefined ? priority : tasks[taskIndex].priority,
      status: status !== undefined ? status : tasks[taskIndex].status
    };

    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex(t => t.id === id && t.userId === req.userId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
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
