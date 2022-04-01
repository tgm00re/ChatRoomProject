const {Room} = require('../models/room.model')

module.exports.createRoom = (req, res) => {
    const {name} = req.body;

    Room.create({
        name: name
    })
        .then(response => res.json(response))
        .catch(err => res.status(400).json(err))
}

module.exports.getAllRooms = (req, res) => {
    Room.find({})
        .then(rooms => res.json(rooms))
        .catch(err => res.json(err));
}

module.exports.addMessage = (req, res) => {
    const {message, senderName, senderImage} = req.body;
    Room.updateOne({_id: req.params._id}, { $push: {messages: {senderName: senderName, message: message, senderImage: senderImage}}})
        .then(response => res.json(response))
        .catch(err => res.json(err));
}

module.exports.getSingleRoom = (req, res) => {
    const {_id} = req.params;
    Room.findById({_id})
        .then(response => res.json(response))
        .catch(err => res.json(err))
}


// module.exports.deleteAll = (req, res) => {
//     Room.deleteMany({})
//         .then(deletedUsers => res.json(deletedUsers))
//         .catch(err => res.json(err));
// }

// module.exports.addRoomUser = (req, res) => {
//     const {userName} = req.body;
    
//     Room.findOne({_id: req.params._id}, )
// }