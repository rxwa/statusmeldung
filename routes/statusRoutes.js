const { Router } = require('express');
const statusController = require('../controllers/statusController');
const { requireAuth } = require('../middleware/authMiddleware')

const router = Router();

router.get('/status', requireAuth, statusController.status_get);
router.post('/status', statusController.status_post);

module.exports = router;