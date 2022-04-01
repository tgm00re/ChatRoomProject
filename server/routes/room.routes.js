const RoomController = require('../controllers/room.controller')

module.exports = function(app){
    app.get('/api/rooms', RoomController.getAllRooms);
    app.get('/api/rooms/:_id', RoomController.getSingleRoom);
    app.post('/api/rooms/create', RoomController.createRoom);
    app.post('/api/rooms/message/:_id', RoomController.addMessage);
    // app.delete('/rooms/deleteall', RoomController.deleteAll)
}