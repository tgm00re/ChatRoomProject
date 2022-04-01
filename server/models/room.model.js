const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Room name is required"],
        minlength: [2, "Room name must be 2 or more characters"],
        maxlength: [15, "Room name must be 15 or less characters"]
    }, 
    users: {
        type: Array,
        default: [] //Will be an array of user names?
    },
    messages: {
        type: Array,
        default: []
    }
})



module.exports.Room = mongoose.model("Room", RoomSchema);