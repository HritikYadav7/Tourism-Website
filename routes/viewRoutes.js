const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
// router.get('/tour', viewController.getTour);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
// router.get('/tour/:slug', authController.protect, viewController.getTour);

// /login
router.get('/login', viewController.getLogin);
// router.get('/login', viewController.log);
router.get('/signup', viewController.getSignUp);
router.get('/me', authController.protect, viewController.getAccount);
router.post('/submit-user-data', viewController.updateUserData);

module.exports = router;
