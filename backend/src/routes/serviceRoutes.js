const express = require('express');
const {
  create,
  list,
  update,
  remove,
} = require('../controllers/ServiceController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateService } = require('../middlewares/validationMiddleware');
const router = express.Router();

router.post('/', validateService, create);
router.get('/',  list);
router.put('/:id', validateService, update);
router.delete('/:id', remove);

module.exports = router;
