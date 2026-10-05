import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
  UploadCloud,
  FileText,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function TaskDetailDrawer({ task, isOpen, onClose, onTaskUpdated }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'attachments'

  // Comments State
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Attachments State
  const [attachments, setAttachments] = useState([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Task Edit State
  const [currentStatus, setCurrentStatus] = useState(task?.status || 'todo');
  const [currentPriority, setCurrentPriority] = useState(task?.priority || 'medium');

  const canManage = ['super_admin', 'admin', 'member'].includes(user?.role);

  useEffect(() => {
    if (task?.id) {
      setCurrentStatus(task.status);
      setCurrentPriority(task.priority);
      fetchComments();
      fetchAttachments();
    }
  }, [task?.id]);

  // Fetch Comments
  const fetchComments = async () => {
    if (!task?.id) return;
    setLoadingComments(true);
    try {
      const data = await api.get(`/comments?task_id=${task.id}`);
      setComments(data.comments || []);
    } catch (err) {
      console.warn('Failed to fetch comments:', err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task?.id) return;
    setSubmittingComment(true);
    try {
      const data = await api.post('/comments', {
        task_id: task.id,
        content: newComment
      });
      if (data.success && data.comment) {
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Add comment error:', err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Delete comment error:', err.message);
    }
  };

  // Fetch Attachments
  const fetchAttachments = async () => {
    if (!task?.id) return;
    setLoadingAttachments(true);
    try {
      const data = await api.get(`/attachments?task_id=${task.id}`);
      setAttachments(data.attachments || []);
    } catch (err) {
      console.warn('Failed to fetch attachments:', err.message);
    } finally {
      setLoadingAttachments(false);
    }
  };

  // Upload Attachment
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !task?.id) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('task_id', task.id);
    formData.append('file', file);

    try {
      const data = await api.post('/attachments', formData);
      if (data.success && data.attachment) {
        fetchAttachments();
      }
    } catch (err) {
      console.error('File upload error:', err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  // Delete Attachment
  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await api.delete(`/attachments/${attachmentId}`);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (err) {
      console.error('Delete attachment error:', err.message);
    }
  };

  // Update Status
  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Status change error:', err.message);
    }
  };

  if (!isOpen || !task) return null;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'high': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'medium': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      default: return 'bg-zinc-800 text-zinc-400 border-white/10';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
        {/* Backdrop overlay clickable to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Slide-Over Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-zinc-950 border-l border-white/15 h-full flex flex-col z-10 shadow-2xl overflow-hidden"
        >
          {/* Top Sticky Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between bg-zinc-950/90 backdrop-blur-md">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityStyle(currentPriority)}`}>
                  {currentPriority} Priority
                </span>

                {canManage ? (
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-zinc-900 border border-white/15 text-white font-semibold text-xs rounded-full px-3 py-0.5 focus:outline-none cursor-pointer capitalize"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Completed</option>
                  </select>
                ) : (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/10 capitalize">
                    {currentStatus.replace('_', ' ')}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {task.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Metadata Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-zinc-900/60 border border-white/10 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                  <User className="w-3 h-3 text-zinc-400" /> Assignee
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {task.assignee_name || 'Unassigned'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-400" /> Due Date
                </span>
                <p className="text-xs font-semibold text-white">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Deadline'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" /> Estimated
                </span>
                <p className="text-xs font-semibold text-white">
                  {task.estimated_hours ? `${task.estimated_hours} hrs` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</h3>
              <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {task.description || 'No detailed description provided for this task.'}
              </div>
            </div>

            {/* Tabs Selector: Comments vs File Attachments */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 border-b border-white/10 pb-2">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`text-xs font-bold flex items-center gap-2 pb-2 -mb-2.5 transition-all cursor-pointer ${
                    activeTab === 'comments'
                      ? 'text-white border-b-2 border-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussion ({comments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`text-xs font-bold flex items-center gap-2 pb-2 -mb-2.5 transition-all cursor-pointer ${
                    activeTab === 'attachments'
                      ? 'text-white border-b-2 border-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Files ({attachments.length})</span>
                </button>
              </div>

              {/* TAB 1: COMMENTS THREAD */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* Comments List */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {loadingComments ? (
                      <p className="text-xs text-zinc-500 text-center py-4">Loading comments...</p>
                    ) : comments.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-6 border border-dashed border-white/5 rounded-2xl">
                        No comments yet. Start the conversation below!
                      </p>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="p-3.5 bg-zinc-900/60 border border-white/5 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={c.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.user_name || 'User')}`}
                                alt={c.user_name}
                                className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10"
                              />
                              <span className="text-xs font-bold text-white">{c.user_name}</span>
                              <span className="text-[10px] text-zinc-500">
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {(c.user_id === user?.id || ['super_admin', 'admin'].includes(user?.role)) && (
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-zinc-300 leading-normal pl-8">
                            {c.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input Form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: FILE ATTACHMENTS */}
              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  {/* File Upload Dropzone */}
                  <label className="border-2 border-dashed border-white/15 hover:border-white/30 bg-zinc-900/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <UploadCloud className="w-8 h-8 text-zinc-400" />
                    <span className="text-xs font-semibold text-zinc-300">
                      {uploadingFile ? 'Uploading file...' : 'Click to upload attachment (Docs, Images, PDFs)'}
                    </span>
                    <span className="text-[10px] text-zinc-500">Max file size: 10MB</span>
                    <input
                      type="file"
                      disabled={uploadingFile}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Attachments List */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {loadingAttachments ? (
                      <p className="text-xs text-zinc-500 text-center py-4">Loading files...</p>
                    ) : attachments.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-4">No attachments uploaded yet.</p>
                    ) : (
                      attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-3 bg-zinc-900/60 border border-white/10 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <a
                                href={`http://localhost:5000${att.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-white hover:underline truncate block"
                              >
                                {att.original_name}
                              </a>
                              <span className="text-[10px] text-zinc-500">
                                {Math.round(att.file_size / 1024)} KB • Uploaded by {att.uploader_name || 'User'}
                              </span>
                            </div>
                          </div>

                          {(att.user_id === user?.id || ['super_admin', 'admin'].includes(user?.role)) && (
                            <button
                              onClick={() => handleDeleteAttachment(att.id)}
                              className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
