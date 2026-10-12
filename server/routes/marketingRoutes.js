const express = require('express');
const router = express.Router();

const marketingController = require('../controllers/marketingController');
const blogAdminController = require('../controllers/blogAdminController');
const { formLimiter, leadLimiter } = require('../middleware/rateLimiter');

// ── Public reads (no session, no auth) ────────────────────────────────
router.get('/changelogs', marketingController.getChangelogs);
router.get('/pricing', marketingController.getPricingPlans);
router.get('/blogs', blogAdminController.getPublicBlogs);
router.get('/blogs/:slug', blogAdminController.getPublicBlogBySlug);

// ── Public writes: rate limited before validation, because the limiter is
//    what stops a bot hammering the endpoint; validation only shapes the
//    response for real users.
router.post('/contact', formLimiter, marketingController.submitContactMessage);
router.post('/waitlist', leadLimiter, marketingController.joinWaitlist);

module.exports = router;