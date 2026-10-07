const pool = require('../config/db');

/**
 * GET /api/v1/tasks?project_id=1&status=todo&assignee_id=3
 * GET /api/v1/tasks?workspace_id=1&status=todo
 * Fetch tasks with optional filters.
 * Scope by either a single project_id, or every project inside a workspace_id.
 */
const getTasks = async (req, res, next) => {
  try {
    const { project_id, workspace_id, status, priority, assignee_id, parent_id } = req.query;

    if (!project_id && !workspace_id) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: either project_id or workspace_id query parameter is required'
      });
    }

    let query = `
      SELECT t.id, t.project_id, t.title, t.description, t.status, t.priority,
             t.due_date, t.estimated_hours, t.actual_hours, t.created_by, t.assignee_id, t.parent_id,
             t.created_at, t.updated_at,
             u_assignee.name AS assignee_name, u_assignee.avatar_url AS assignee_avatar,
             u_creator.name AS creator_name,
             (SELECT COUNT(*) FROM tasks sub WHERE sub.parent_id = t.id) AS subtask_count,
             (SELECT COUNT(*) FROM task_comments tc WHERE tc.task_id = t.id) AS comment_count
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
      LEFT JOIN users u_creator ON t.created_by = u_creator.id
    `;

    const queryParams = [];

    // Scope: project_id wins when both are supplied, so an explicit project
    // filter is never silently widened to a whole workspace.
    if (project_id) {
      query += ' WHERE t.project_id = ?';
      queryParams.push(project_id);
    } else {
      query += ' WHERE p.workspace_id = ?';
      queryParams.push(workspace_id);
    }

    if (status) {
      query += ' AND t.status = ?';
      queryParams.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      queryParams.push(priority);
    }

    if (assignee_id) {
      query += ' AND t.assignee_id = ?';
      queryParams.push(assignee_id);
    }

    if (parent_id !== undefined) {
      if (parent_id === 'null' || parent_id === '') {
        query += ' AND t.parent_id IS NULL';
      } else {
        query += ' AND t.parent_id = ?';
        queryParams.push(parent_id);
      }
    }

    query += ' ORDER BY t.created_at DESC';

    const [tasks] = await pool.query(query, queryParams);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/tasks
 * Create a new task or subtask
 */
const createTask = async (req, res, next) => {
  try {
    const {
      project_id,
      title,
      description,
      status = 'todo',
      priority = 'medium',
      due_date,
      estimated_hours = 0,
      assignee_id,
      parent_id
    } = req.body;

    const userId = req.user.id;

    if (!project_id || !title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: project_id and task title are required'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks 
       (project_id, title, description, status, priority, due_date, estimated_hours, created_by, assignee_id, parent_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        title.trim(),
        description || null,
        status,
        priority,
        due_date || null,
        estimated_hours,
        userId,
        assignee_id || null,
        parent_id || null
      ]
    );

    const taskId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: {
        id: taskId,
        project_id,
        title: title.trim(),
        status,
        priority,
        assignee_id,
        parent_id
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/tasks/:id/status
 * Kanban status update (drag and drop)
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['todo', 'in_progress', 'in_review', 'done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: status must be one of [${validStatuses.join(', ')}]`
      });
    }

    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ?', [taskId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId]);

    res.status(200).json({
      success: true,
      message: `Task status updated to '${status}'`
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/tasks/:id
 * Delete a task by ID
 */
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ?', [taskId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask
};
