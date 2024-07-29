// import express
const express = require('express');

// import validate result from express-validator
const { validationResult } = require("express-validator");

// import bcrypt
const bcrypt = require('bcryptjs');

// import jsonwebtoken
const jwt = require('jsonwebtoken');

// import prisma client
const prisma = require('../prisma/client');

// funtion login
const login = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  try {
    // find user
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // compare password
    const validatePassword = await bcrypt.compare(req.body.password, user.password);

    // invalid password
    if (!validatePassword) {

      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // generate token jwt
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // Destructure to remove password from user object
    const { password, ...userWithoutPassword } = user;

    //return response
    res.status(200).send({
      success: true,
      message: "Login successfully",
      data: {
        user: userWithoutPassword,
        token: token,
      },
    });



  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { login };