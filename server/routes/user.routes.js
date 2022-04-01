const UserController = require('../controllers/user.controller');
const {authenticate} = require("../config/jwt.config")

module.exports = function(app){
    app.get('/api/users', UserController.getAllUsers);
    app.get('/api/users/:_id', UserController.getSingleUser)
    app.get('/api/users/getbyemail/:email', UserController.getUserByEmail)
    app.post('/api/getloggedinuser', authenticate, UserController.getLoggedInUser)
    app.post('/api/users/register', UserController.registerUser)
    app.post('/api/users/addroom/:_id', UserController.addRoom)
    app.post('/api/login', UserController.login)
    app.patch('/api/users/update/:_id', UserController.updateUser)
    app.delete('/api/users/delete/:_id', UserController.deleteUser)
    // app.delete('/deleteall', UserController.deleteAll)
}
