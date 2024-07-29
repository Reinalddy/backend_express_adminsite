// import express validator
const { body } = require('express-validator');
// import prisma
const { PrismaClient } = require('../../prisma/client');
// definisi validasi untuk register
const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid')
    .custom(async (value) => {
      if (!value) {
        throw new Error('Email is required')
      }

      const user = await PrismaClient.user.findUnique({ where: { email: value } });

      if (user) {
        throw new Error('Email is already in use')
      }

      return true
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

];

//definisikan validasi untuk login
const validateLogin = [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];


module.exports = { validateRegister, validateLogin };