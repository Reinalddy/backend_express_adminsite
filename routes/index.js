// import express
const express = require('express');

// init express router
const router = express.Router();

// import verify token
const verifyToken = require('../middleware/auth');

// import register controller
const registerController = require('../controllers/RegisterController');

// import login controller
const loginController = require('../controllers/LoginController');

// import user controller
const userController = require('../controllers/UserController');

// import validate register
const { validateRegister, validateLogin } = require('../utils/validators/auth');

// import validate user
const { validateUser } = require('../utils/validators/user');

// define routes for register
router.post('/register', validateRegister, registerController.register);

// define routes for login
router.post('/login', validateLogin, loginController.login);

// define routes for get all users
router.get('/admin/users', verifyToken, userController.findUser);

// define routes for create user
router.post('/admin/users', verifyToken, validateUser, userController.createUser);

// define routes for get user by id
router.get('/admin/users/:id', verifyToken, userController.findUserById);

// definde routes for update user
router.put('/admin/users/:id', verifyToken, validateUser, userController.updateUser);

// define routes for delete user
router.delete('/admin/users/:id', verifyToken, userController.deleteUser);

// export router
module.exports = router;