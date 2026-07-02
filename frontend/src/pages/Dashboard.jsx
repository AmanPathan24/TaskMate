import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Search, Edit2, Trash2, Calendar, 
  X, AlertCircle, ClipboardList 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  // Task List States
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form States
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskStatus, setTaskStatus] = useState('pending');

  // Load Tasks
  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (priorityFilter) queryParams.append('priority', priorityFilter);
      if (sortBy) queryParams.append('sortBy', sortBy);
      queryParams.append('page', currentPage);
      queryParams.append('limit', 6);

      const response = await fetch(`http://localhost:5000/api/tasks?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 on search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter, sortBy]);

  // Load tasks on mount or dependency change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, currentPage, search, statusFilter, priorityFilter, sortBy]);

  // Handle Modal Open (Create/Edit)
  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskDesc(task.description);
      setTaskDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setTaskPriority(task.priority);
      setTaskStatus(task.status);
    } else {
      setEditingTask(null);
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
      setTaskPriority('medium');
      setTaskStatus('pending');
    }
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Create or Update Task
  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const taskData = {
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: taskStatus
      };

      let response;
      if (editingTask) {
        // Update
        response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(taskData)
        });
      } else {
        // Create
        response = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(taskData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save task');
      }

      closeModal();
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle Task Status (Pending / Completed)
  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Render Landing View
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <div className="landing-hero">
          <img src="/TaskMate Logo.png" alt="TaskMate Logo" className="landing-logo" />
          <h1>Manage student tasks effectively.</h1>
          <p>
            Organize assignments, study plans, and project deadlines in one single place. Designed beautifully to keep your focus on learning.
          </p>
          <div className="landing-actions">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started for Free
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      {/* Header section */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>My Study Dashboard</h1>
          <p>Manage your school assignments and personal goals.</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Filter and controls bar */}
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon-left" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="dueDate:asc">Soonest Due</option>
            <option value="dueDate:desc">Latest Due</option>
            <option value="title:asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="auth-error" style={{ width: '100%' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Task List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading your study workspace...
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={48} style={{ color: 'var(--text-muted)' }} />
          <h3>No tasks found</h3>
          <p>Try adjusting your search queries or filters, or create a brand new study task.</p>
          <button className="btn-primary" onClick={() => openModal()} style={{ marginTop: '0.5rem' }}>
            Add Task
          </button>
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <div className="task-badges">
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`badge status-${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="task-card-checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleStatus(task)}
                    title="Toggle Completion"
                  />
                </div>

                <div className="task-card-content">
                  <h3 className={`task-card-title ${task.status === 'completed' ? 'completed' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="task-card-desc">{task.description}</p>
                  )}
                </div>

                <div className="task-card-footer">
                  <span className="task-date-info">
                    <Calendar size={14} />
                    {formatDate(task.dueDate)}
                  </span>
                  <div className="task-card-actions">
                    <button 
                      className="action-btn" 
                      onClick={() => openModal(task)} 
                      title="Edit Task"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button 
                      className="action-btn btn-delete" 
                      onClick={() => handleDeleteTask(task.id)} 
                      title="Delete Task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-nav-btn" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`pagination-page-num ${currentPage === p ? 'active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button 
                className="pagination-nav-btn" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Task Creation & Editing Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Study Task' : 'Create New Task'}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveTask}>
              <div className="modal-body">
                <div className="modal-form">
                  <div className="modal-form-group">
                    <label htmlFor="title">Task Title</label>
                    <input
                      id="title"
                      type="text"
                      className="modal-input"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Math Assignment 3, Study History Chapter 4..."
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label htmlFor="desc">Description</label>
                    <textarea
                      id="desc"
                      className="modal-textarea"
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      placeholder="Add details, resources, links, or notes..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="modal-form-group">
                      <label htmlFor="dueDate">Due Date</label>
                      <input
                        id="dueDate"
                        type="date"
                        className="modal-input"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                      />
                    </div>

                    <div className="modal-form-group">
                      <label htmlFor="priority">Priority</label>
                      <select
                        id="priority"
                        className="modal-select"
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {editingTask && (
                    <div className="modal-form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        className="modal-select"
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
