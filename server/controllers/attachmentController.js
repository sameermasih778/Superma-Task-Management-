const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

/**
 * POST /api/v1/attachments
 * Upload a document/image attachment for a task
 */
const uploadAttachment = async (req, res, next) => {
  try {
    const { task_id } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!task_id || !file) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: task_id and file upload are required'
      });
    }

    const file_path = `/uploads/${file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO task_attachments (task_id, user_id, filename, original_name, file_path, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [task_id, userId, file.filename, file.originalname, file_path, file.size, file.mimetype]
    );

    const attachmentId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      attachment: {
        id: attachmentId,
        task_id,
        filename: file.filename,
        original_name: file.originalname,
        file_path,
        file_size: file.size,
        mime_type: file.mimetype
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/attachments?task_id=1
 * Fetch attachments for a task
 */
const getTaskAttachments = async (req, res, next) => {
  try {
    const { task_id } = req.query;

    if (!task_id) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: task_id query parameter is required'
      });
    }

    const [attachments] = await pool.query(
      `SELECT ta.id, ta.task_id, ta.user_id, ta.filename, ta.original_name, 
              ta.file_path, ta.file_size, ta.mime_type, ta.created_at,
              u.name AS uploader_name
       FROM task_attachments ta
       JOIN users u ON ta.user_id = u.id
       WHERE ta.task_id = ?
       ORDER BY ta.created_at DESC`,
      [task_id]
    );

    res.status(200).json({
      success: true,
      count: attachments.length,
      attachments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/attachments/:id
 * Delete an attachment
 */
const deleteAttachment = async (req, res, next) => {
  try {
    const attachmentId = req.params.id;

    const [existing] = await pool.query('SELECT filename FROM task_attachments WHERE id = ?', [attachmentId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Delete file from disk if exists
    const diskPath = path.join(__dirname, '../uploads', existing[0].filename);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }

    await pool.query('DELETE FROM task_attachments WHERE id = ?', [attachmentId]);

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment
};
