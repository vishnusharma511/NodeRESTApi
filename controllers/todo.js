const { Todo, todoValidationSchema } = require("../models/todo");
const { generateErrorMessage, handleServerError, handleNotFoundError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/responseHandler");

async function getAllTodos(req, res) {
  try {
    const todos = await Todo.find();
    sendResponse(res, 200, todos, "Todos list");
  } catch (err) {
    handleServerError(res, err);
  }
}

async function createTodo(req, res) {
  try {
    await validateTodo(req.body);
    const newTodo = await Todo.create(req.body);
    sendResponse(res, 201, newTodo, "Todo created successfully");
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function getTodo(req, res) {
  try {
    const todo = await Todo.findById(req.params.id);
    handleNotFoundError(res, todo, "Todo Not Found");
    sendResponse(res, 200, todo, "Todo retrieved successfully");
  } catch (err) {
    handleServerError(res, err);
  }
}

async function updateTodo(req, res) {
  try {
    await validateTodo(req.body);
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    handleNotFoundError(res, todo, "Todo Not Found");
    sendResponse(res, 200, todo, "Todo updated successfully");
  } catch (err) {
    handleValidationError(res, err);
  }
}

async function deleteTodo(req, res) {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return handleNotFoundError(res, null, "Todo not found");
    }
    sendResponse(res, 204, null, "Todo deleted successfully");
  } catch (err) {
    handleServerError(res, err);
  }
}

async function validateTodo(todoData) {
  await todoValidationSchema.validate(todoData, { abortEarly: false });
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
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
};
