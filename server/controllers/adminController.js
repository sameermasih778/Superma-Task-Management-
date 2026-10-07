const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * GET /api/v1/admin/users
 * List all registered users (Admin/Super Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT id, name, email, role, status, created_at,
        (SELECT COUNT(*) FROM workspace_members wm WHERE wm.user_id = users.id) as workspace_count
       FROM users
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/users/:id/role
 * Update a user's role (Admin/Super Admin only)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['super_admin', 'admin', 'developer', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Valid roles: ${validRoles.join(', ')}`
      });
    }

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    // Only a Super Admin may grant the super_admin role, otherwise an
    // admin/developer could escalate privileges via any account they control.
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only a Super Admin can grant the 'super_admin' role"
      });
    }

    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}' successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/users/:id/status
 * Suspend / Re-activate a user account (Admin, Developer & Super Admin)
 * A suspended user is blocked at login by authController.login
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own account status'
      });
    }

    // Fetch target so we can protect Super Admin accounts from lower roles
    const [users] = await pool.query(
      'SELECT id, name, role, status FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const target = users[0];

    if (target.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only a Super Admin can change the status of a Super Admin account'
      });
    }

    const [result] = await pool.query(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verb = status === 'active' ? 're-activated' : status === 'suspended' ? 'suspended' : 'marked inactive';

    res.status(200).json({
      success: true,
      message: `User "${target.name}" has been ${verb} successfully`,
      status
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/users/:id/reset-password
 * Reset a user's password and send new temp password via email
 */
const resetUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    // Generate secure temporary password
    const tempPassword = `Sup${Math.random().toString(36).slice(-6)}!${Math.floor(Math.random() * 9000 + 1000)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, id]
    );

    // Send email with temp password if SMTP configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });

        await transporter.sendMail({
          from: `"Suprema OS Admin" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: '🔐 Your Suprema Password Has Been Reset by Admin',
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 40px 20px;">
              <div style="max-width: 480px; margin: 0 auto; background-color: #18181b; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; text-align: center;">
                <h2 style="color: #ffffff; margin-bottom: 8px;">Password Reset</h2>
                <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
                  Hi <strong style="color: #fff;">${user.name}</strong>, your Suprema account password has been reset by an administrator.
                </p>
                <div style="background-color: #000; border: 1px solid #6366f1; border-radius: 14px; padding: 18px; font-size: 20px; font-weight: 800; letter-spacing: 4px; color: #818cf8; margin-bottom: 24px;">
                  ${tempPassword}
                </div>
                <p style="color: #71717a; font-size: 12px;">Please log in with this temporary password and change it immediately in your account settings.</p>
              </div>
            </div>
          `
        });
        console.log(`[Admin] Password reset email sent to ${user.email}`);
      } catch (emailErr) {
        console.error('[Admin] Password reset email failed:', emailErr.message);
      }
    } else {
      console.log(`[DEV] Temp password for ${user.email}: ${tempPassword}`);
    }

    res.status(200).json({
      success: true,
      message: `Password reset successful. Temporary password sent to ${user.email}`,
      ...(!process.env.SMTP_USER && { tempPassword })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/admin/users/:id
 * Delete a user account (Super Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/admin/notifications/broadcast
 * Send a global announcement to ALL users (Admin/Super Admin only)
 */
const broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, type = 'announcement' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const [users] = await pool.query('SELECT id FROM users');

    if (users.length === 0) {
      return res.status(200).json({ success: true, message: 'No users to notify' });
    }

    // Bulk insert one notification row per user
    const values = users.map(u => [u.id, title, message, type, false]);
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type, is_read) VALUES ?',
      [values]
    );

    res.status(201).json({
      success: true,
      message: `Broadcast sent to ${users.length} users`,
      recipientCount: users.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
  broadcastNotification
};
