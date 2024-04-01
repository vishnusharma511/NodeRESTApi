const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
  } = require('../controllers/user');
  const { User } = require('../models/user');
  
  jest.mock('../models/user');
  jest.mock('../utils/errorHandler');
  jest.mock('../utils/responseHandler');
  
  const { handleNotFoundError, handleServerError } = require('../utils/errorHandler');
  const { sendResponse } = require('../utils/responseHandler');
  
  describe('UserController', () => {
    describe('getAllUsers', () => {
      it('should return list of users with status code 200', async () => {
        const users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
        User.find.mockResolvedValue(users);
  
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await getAllUsers(req, res);
  
        expect(User.find).toHaveBeenCalledTimes(1);
        expect(sendResponse).toHaveBeenCalledWith(res, 200, users, 'Users list');
      });
  
      it('should handle server error', async () => {
        const error = new Error('Test error');
        User.find.mockRejectedValue(error);
  
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await getAllUsers(req, res);
  
        expect(handleServerError).toHaveBeenCalledWith(res, error);
      });
    });
  
    describe('createUser', () => {
      it('should create a new user with status code 201', async () => {
        const newUser = { id: 1, name: 'New User' };
        User.create.mockResolvedValue(newUser);
  
        const req = { body: newUser };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await createUser(req, res);
  
        expect(User.create).toHaveBeenCalledWith(newUser);
        expect(sendResponse).toHaveBeenCalledWith(res, 201, newUser, 'User created successfully');
      });
  
      it('should handle validation error', async () => {
        const validationError = new Error('Validation error');
        validationError.name = 'ValidationError';
        User.create.mockRejectedValue(validationError);
      
        const req = { body: { name: 'New User' , email: 'example@gmail.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
        await createUser(req, res);

        expect(sendResponse).toHaveBeenCalledWith(res, 400, null, expect.any(Object));
      });
      
  
      it('should handle server error', async () => {
        const error = new Error('Test error');
        User.create.mockRejectedValue(error);
  
        const req = { body: { name: 'New User' , email: 'example@gmail.com'} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await createUser(req, res);
  
        expect(handleServerError).toHaveBeenCalledWith(res, error);
      });
    });
  
    describe('getUser', () => {
      it('should return a user with status code 200', async () => {
        const user = { id: 1, name: 'User 1' };
        User.findById.mockResolvedValue(user);
  
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await getUser(req, res);
  
        expect(User.findById).toHaveBeenCalledWith(1);
        expect(sendResponse).toHaveBeenCalledWith(res, 200, user, 'User get successfully');
      });
  
      it('should handle user not found', async () => {
        User.findById.mockResolvedValue(null);
  
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await getUser(req, res);
  
        expect(handleNotFoundError).toHaveBeenCalledWith(res, null, 'User Not Found');
      });
  
      it('should handle server error', async () => {
        const error = new Error('Test error');
        User.findById.mockRejectedValue(error);
  
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await getUser(req, res);
  
        expect(handleServerError).toHaveBeenCalledWith(res, error);
      });
    });
  
    describe('updateUser', () => {
      it('should update a user with status code 200', async () => {
        const updatedUser = { id: 1, name: 'Updated User' };
        User.findByIdAndUpdate.mockResolvedValue(updatedUser);
  
        const req = { params: { id: 1 }, body: updatedUser };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await updateUser(req, res);
  
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(1, updatedUser, { new: true });
        expect(sendResponse).toHaveBeenCalledWith(res, 200, updatedUser, 'User updated successfully');
      });
  
      it('should handle user not found', async () => {
        User.findByIdAndUpdate.mockResolvedValue(null);
  
        const req = { params: { id: 1 }, body: { name: 'Updated User' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await updateUser(req, res);
  
        expect(handleNotFoundError).toHaveBeenCalledWith(res, null, 'User Not Found');
      });
  
      it('should handle validation error', async () => {
        const error = new Error('Validation error');
        error.name = 'ValidationError';
        User.findByIdAndUpdate.mockRejectedValue(error);
  
        const req = { params: { id: 1 }, body: { name: 'Updated User' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await updateUser(req, res);
  
        expect(sendResponse).toHaveBeenCalledWith(res, 400, null, expect.any(Object));
      });
  
      it('should handle server error', async () => {
        const error = new Error('Test error');
        User.findByIdAndUpdate.mockRejectedValue(error);
  
        const req = { params: { id: 1 }, body: { name: 'Updated User' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await updateUser(req, res);
  
        expect(handleServerError).toHaveBeenCalledWith(res, error);
      });
    });
  
    describe('deleteUser', () => {
      it('should delete a user with status code 204', async () => {
        const deletedUser = { id: 1, name: 'Deleted User' };
        User.findByIdAndDelete.mockResolvedValue(deletedUser);
  
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await deleteUser(req, res);
  
        expect(User.findByIdAndDelete).toHaveBeenCalledWith(1);
        expect(sendResponse).toHaveBeenCalledWith(res, 204, null, 'User deleted successfully');
      });
  
      it('should handle user not found', async () => {
        User.findByIdAndDelete.mockResolvedValue(null);
  
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await deleteUser(req, res);
  
        expect(handleNotFoundError).toHaveBeenCalledWith(res, null, 'User not found');
      });
  
      it('should handle server error', async () => {
        const error = new Error('Test error');
        User.findByIdAndDelete.mockRejectedValue(error);
  
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await deleteUser(req, res);
  
        expect(handleServerError).toHaveBeenCalledWith(res, error);
      });
    });
  });
  