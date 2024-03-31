const { User, userValidationSchema } = require("../models/user");
const { generateErrorMessage } = require("../utils/errorHandler");

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    handleServerError(res, err);
  }
}

async function createUser(req, res) {
  try {
    await validateUser(req.body);
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    handleNotFound(res, user);
    res.status(200).json(user);
  } catch (err) {
    handleServerError(res, err);
  }
}

async function updateUser(req, res) {
  try {
    await validateUser(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    handleNotFound(res, user);
    res.json(user);
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    handleNotFound(res, user);
    res.status(204).json({ message: "User deleted successfully" });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function validateUser(userData) {
  await userValidationSchema.validate(userData, { abortEarly: false });
}

function handleValidationError(res, err) {
  if (err.name === "ValidationError") {
    const errors = generateErrorMessage(err.inner);
    res.status(400).json({ errors });
  } else {
    handleServerError(res, err);
  }
}

function handleNotFound(res, data) {
  if (!data) {
    res.status(404).json({ message: "User not found" });
    throw new Error("User not found");
  }
}

function handleServerError(res, err) {
  res.status(500).json({ message: err.message });
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
