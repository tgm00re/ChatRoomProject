const mongoose = require('mongoose');

mongoose.set("runValidators", true);
mongoose.connect("mongodb://localhost/chatroom", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}) 
    .then(() => console.log("established connection with the database"))
    .catch(err => console.log("error connecting to the database", err))


