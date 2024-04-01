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

module.exports = { Todo, todoValidationSchema };
