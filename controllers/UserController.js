// import express
const express = require('express');
// import prisma client
const prisma = require('../prisma/client');
// import validation result forn express-validatior
const { validationResult } = require("express-validator");
// import bcrypt
const bcrypt = require('bcryptjs');

// function find user
const findUser = async (req, res) => {
  try {

    // get all user from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    // send response
    res.status(200).send({
      success: true,
      message: "Get all users successfuly",
      data: users
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    })

  }
};

const createUser = async (req, res) => {
  // check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {

    // insert data
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      },
    });

    res.status(201).send({
      success: true,
      message: "Create user successfuly",
      data: user
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    })
  }



}

const findUserById = async (req, res) => {

  // get id from params
  const { id } = req.params;

  try {

    // find user by id
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // send response
    res.status(200).send({
      success: true,
      message: `Get user by ID :${id}`,
      data: user
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    })
  }
};

const updateUser = async (req, res) => {

  // get id from params
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {

    // update user
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      },
    });

    // send response
    res.status(200).send({
      success: true,
      message: `Update user by ID :${id}`,
      data: user
    })

  } catch (error) {

    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });

  }


}

const deleteUser = async (req, res) => {

  // get id from params
  const { id } = req.params;

  try {
    // delete users
    await prisma.user.delete({
      where: {
        id: Number(id)
      }
    });

    // send response
    res.status(200).send({
      success: true,
      message: `Delete user by ID :${id}`,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    })

  }
}
module.exports = { findUser, createUser, findUserById, updateUser, deleteUser };