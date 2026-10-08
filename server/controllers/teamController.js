const pool = require('../config/db');
const { logActivity } = require('../utils/activityLogger');

/**
 * GET /api/v1/teams?workspace_id=1
 * Fetch teams inside a workspace
 */
const getTeams = async (req, res, next) => {
  try {
    const { workspace_id } = req.query;

    if (!workspace_id) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: workspace_id query parameter is required'
      });
    }

    const [teams] = await pool.query(
      `SELECT t.id, t.workspace_id, t.name, t.description, t.created_at,
              (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) AS member_count
       FROM teams t 
       WHERE t.workspace_id = ? 
       ORDER BY t.created_at DESC`,
      [workspace_id]
    );

    res.status(200).json({
      success: true,
      count: teams.length,
      teams
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/teams
 * Create a team within a workspace
 */
const createTeam = async (req, res, next) => {
  try {
    const { workspace_id, name, description } = req.body;
    const userId = req.user.id;

    if (!workspace_id || !name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: workspace_id and team name are required'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO teams (workspace_id, name, description) VALUES (?, ?, ?)',
      [workspace_id, name.trim(), description || null]
    );

    const teamId = result.insertId;

    // Automatically add creator as team leader
    await pool.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, "leader")',
      [teamId, userId]
    );

    // Activity log
    await logActivity({
      workspace_id,
      user_id: userId,
      action: 'TEAM_CREATED',
      entity_type: 'team',
      entity_id: teamId,
      details: { name: name.trim(), description }
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team: {
        id: teamId,
        workspace_id,
        name: name.trim(),
        description,
        member_count: 1
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/teams/:id/members
 * Fetch team members
 */
const getTeamMembers = async (req, res, next) => {
  try {
    const teamId = req.params.id;

    const [members] = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, tm.role, tm.joined_at,
              u.role AS global_role
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = ?
       ORDER BY tm.joined_at ASC`,
      [teamId]
    );

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/teams/:id/members
 * Add user to team
 */
const addTeamMember = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const { user_id, role = 'member' } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: user_id is required'
      });
    }

    const [teamRows] = await pool.query('SELECT workspace_id, name FROM teams WHERE id = ?', [teamId]);
    if (teamRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const [existing] = await pool.query(
      'SELECT id FROM team_members WHERE team_id = ? AND user_id = ?',
      [teamId, user_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: User is already a member of this team'
      });
    }

    await pool.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)',
      [teamId, user_id, role]
    );

    await logActivity({
      workspace_id: teamRows[0].workspace_id,
      user_id: req.user.id,
      action: 'TEAM_MEMBER_ADDED',
      entity_type: 'team',
      entity_id: Number(teamId),
      details: { team_name: teamRows[0].name, user_id, role }
    });

    res.status(201).json({
      success: true,
      message: 'Member added to team successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/teams/:id/members/:userId
 * Remove user from team
 */
const removeTeamMember = async (req, res, next) => {
  try {
    const { id: teamId, userId } = req.params;

    const [teamRows] = await pool.query('SELECT workspace_id, name FROM teams WHERE id = ?', [teamId]);
    if (teamRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    await pool.query(
      'DELETE FROM team_members WHERE team_id = ? AND user_id = ?',
      [teamId, userId]
    );

    await logActivity({
      workspace_id: teamRows[0].workspace_id,
      user_id: req.user.id,
      action: 'TEAM_MEMBER_REMOVED',
      entity_type: 'team',
      entity_id: Number(teamId),
      details: { team_name: teamRows[0].name, removed_user_id: userId }
    });

    res.status(200).json({
      success: true,
      message: 'Member removed from team'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/teams/:id
 * Delete team
 */
const deleteTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;

    const [teamRows] = await pool.query('SELECT workspace_id, name FROM teams WHERE id = ?', [teamId]);
    if (teamRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    await pool.query('DELETE FROM teams WHERE id = ?', [teamId]);

    await logActivity({
      workspace_id: teamRows[0].workspace_id,
      user_id: req.user.id,
      action: 'TEAM_DELETED',
      entity_type: 'team',
      entity_id: Number(teamId),
      details: { name: teamRows[0].name }
    });

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeams,
  createTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  deleteTeam
};
