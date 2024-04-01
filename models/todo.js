const mongoose = require('mongoose');
const yup = require('yup');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

const todoValidationSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    completed: yup.boolean().required('Completion status is required'),
    createdBy: yup.string().required('Created by is required')
});

async function paginateTodos(page, limit) {
    const skip = (page - 1) * limit;
    const todos = await Todo.find().skip(skip).limit(limit);
    const totalCount = await Todo.countDocuments();
    return { todos, totalCount };
}

function createPaginationMetadata(page, limit, totalCount, totalPages) {
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? `/todos?page=${page + 1}&limit=${limit}` : null;
    const prevPage = hasPrevPage ? `/todos?page=${page - 1}&limit=${limit}` : null;
    return { totalCount, totalPages, currentPage: page, nextPage, prevPage };
  }

module.exports = { Todo, todoValidationSchema, paginateTodos, createPaginationMetadata };

