const pool = require('../config/db');
const path = require('path');
const { saveAttachment, removeStoredAsset } = require('../config/assetStorage');

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

    // Cloudinary when CLOUDINARY_URL is configured (production/Vercel),
    // local disk otherwise. `publicId` is stored in the filename column so a
    // later delete can target the exact stored object.
    const ext = path.extname(file.originalname).toLowerCase();
    const stored = await saveAttachment(file.buffer, { ext, mime: file.mimetype });
    const file_path = stored.url;

    const [result] = await pool.query(
      `INSERT INTO task_attachments (task_id, user_id, filename, original_name, file_path, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [task_id, userId, stored.publicId, file.originalname, file_path, file.buffer.length, file.mimetype]
    );

    const attachmentId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      attachment: {
        id: attachmentId,
        task_id,
        filename: stored.publicId,
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

    const [existing] = await pool.query('SELECT filename, file_path FROM task_attachments WHERE id = ?', [attachmentId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Remove the stored object (Cloudinary URL or legacy local file). Cleanup
    // is best-effort and must never fail the request.
    try {
      await removeStoredAsset(existing[0].file_path);
    } catch (cleanupError) {
      console.warn('[Attachment] Could not remove stored file:', cleanupError.message);
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
