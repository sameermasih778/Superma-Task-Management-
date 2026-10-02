const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'suprema_jwt_super_secret_key_2026_dev_mode';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT Token Helper
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Controller: Register New User
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
  let connection;
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Password must be at least 6 characters long'
      });
    }

    connection = await pool.getConnection();

    // 1. Check if email exists
    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: 'Registration Error: Email is already registered'
      });
    }

    // 2. Hash Password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const avatar_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    await connection.beginTransaction();

    // 3. Insert User
    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password_hash, avatar_url, role, status) VALUES (?, ?, ?, ?, "member", "active")',
      [name, email, password_hash, avatar_url]
    );

    const userId = userResult.insertId;

    // 4. Create Default Workspace for new user
    const workspaceName = `${name}'s Workspace`;
    const workspaceSlug = `ws-${userId}-${Date.now().toString(36)}`;

    const [workspaceResult] = await connection.query(
      'INSERT INTO workspaces (name, slug, owner_id, plan) VALUES (?, ?, ?, "free")',
      [workspaceName, workspaceSlug, userId]
    );

    const workspaceId = workspaceResult.insertId;

    // 5. Add User as Workspace Owner
    await connection.query(
      'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, "owner")',
      [workspaceId, userId]
    );

    await connection.commit();
    connection.release();

    // 6. Generate Token
    const userPayload = { id: userId, name, email, role: 'member', avatar_url };
    const token = generateToken(userPayload);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Suprema.',
      token,
      user: {
        ...userPayload,
        workspaces: [
          { id: workspaceId, name: workspaceName, slug: workspaceSlug, role: 'owner' }
        ]
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    next(error);
  }
};

/**
 * Controller: User Login
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Email and password are required'
      });
    }

    // 1. Fetch user by email
    const [users] = await pool.query(
      'SELECT id, name, email, password_hash, avatar_url, role, status FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Authentication Failed: Invalid email or password'
      });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account Suspended: Your account status is '${user.status}'. Contact support.`
      });
    }

    // 2. Verify Password Hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Authentication Failed: Invalid email or password'
      });
    }

    // 3. Fetch User's Workspaces
    const [workspaces] = await pool.query(
      `SELECT w.id, w.name, w.slug, w.plan, wm.role 
       FROM workspaces w 
       JOIN workspace_members wm ON w.id = wm.workspace_id 
       WHERE wm.user_id = ?`,
      [user.id]
    );

    // 4. Generate Token & Respond
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url
    };

    const token = generateToken(userPayload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        ...userPayload,
        workspaces
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get Current Logged-in User Profile
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const [users] = await pool.query(
      'SELECT id, name, email, avatar_url, role, status, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const user = users[0];

    // Fetch workspaces
    const [workspaces] = await pool.query(
      `SELECT w.id, w.name, w.slug, w.plan, wm.role 
       FROM workspaces w 
       JOIN workspace_members wm ON w.id = wm.workspace_id 
       WHERE wm.user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      user: {
        ...user,
        workspaces
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
