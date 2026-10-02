const pool = require('../config/db');

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
      `SELECT u.id, u.name, u.email, u.avatar_url, tm.role, tm.joined_at 
       FROM team_members tm 
       JOIN users u ON tm.user_id = u.id 
       WHERE tm.team_id = ?`,
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

module.exports = {
  getTeams,
  createTeam,
  getTeamMembers
};
