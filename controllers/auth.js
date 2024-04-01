const bcrypt = require("bcryptjs");
const { User, userValidationSchema } = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");
const { sendResponse } = require("../utils/responseHandler");
const {
  generateErrorMessage,
  handleServerError,
} = require("../utils/errorHandler");

async function register(req, res) {
  try {
    const { name, email, mobile, password, role } = req.body;
    if (typeof password !== "string") {
      return sendResponse(res, 400, null, "Password must be a string");
    }
    await validateUser({ name, email, mobile, password, role });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    sendResponse(res, 201, null, "User registered successfully");
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return sendResponse(res, 401, null, "Invalid password");
    }
    const token = generateToken({ userId: user._id, role:user.role });
    sendResponse(res, 200, { token }, "Login successful");
  } catch (error) {
    sendResponse(res, 500, null, "Login failed");
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

module.exports = { register, login };
