const { User, userValidationSchema } = require("../models/user");
const { generateErrorMessage, handleServerError, handleNotFoundError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/responseHandler");

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    sendResponse(res, 200, users, "Users list");
  } catch (err) {
    handleServerError(res, err);
  }
}

async function createUser(req, res) {
  try {
    await validateUser(req.body);
    const newUser = await User.create(req.body);
    sendResponse(res, 201, newUser, "User created successfully");
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    handleNotFoundError(res, user, "User Not Found");
    sendResponse(res, 200, user, "User get successfully");
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
    handleNotFoundError(res, user, "User Not Found");
    sendResponse(res, 200, user, "User updated successfully");
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return handleNotFoundError(res, null, "User not found");
    }
    sendResponse(res, 204, null, "User deleted successfully");
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
    sendResponse(res, 400, null, errors);
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    const duplicateKeyErrorMessage = parseDuplicateKeyErrorMessage(err.message);
    sendResponse(res, 400, null, duplicateKeyErrorMessage);
  } else {
    handleServerError(res, err);
  }
}

function parseDuplicateKeyErrorMessage(errorMessage) {
  const startIdx = errorMessage.lastIndexOf("index: ") + 7;
  const endIdx = errorMessage.lastIndexOf(" dup");
  const key = errorMessage.substring(startIdx, endIdx);
  return `Duplicate key error for field: ${key}`;
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
