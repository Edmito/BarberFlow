const express = require('express');
const {
  listUsersByRole,
  updateUser,
  deleteUser,
} = require('../controllers/UserController');
const { validateBasicUser } = require('../middlewares/validationMiddleware');
const router = express.Router();

router.get('/', listUsersByRole);
router.put('/:id', validateBasicUser, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
