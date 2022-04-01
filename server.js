const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;
const cookieParser = require('cookie-parser');
const e = require('cors');



/*jwt can be required in our project via:
const jwt = require('jsonwebtoken');
//We will also want to create a payload that looks something like: const payload = {
        id: user._id
      };

    We would also need a secret key to ensure that data isn't tampered with.
    const userToken = jwt.sign(payload, process.env.SECRET_KEY)
*/

require('./server/config/mongoose.config')


//Middleware
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

require('./server/routes/user.routes')(app);
require('./server/routes/room.routes')(app);

const server = app.listen(port, () => {
    console.log("The server is running on port", port, ".")
})


const io = require('socket.io')(server, {secure: true ,cors: {origin: "*"}});

//Socket.io

io.on('connection', socket => {
    socket.emit("Welcome", (socket.id +" you've connected from the client side!"));

    socket.on("newMessage", data => {
        console.log("Server got message emit. Sending an emit now.")
        io.emit("newMessage", {senderName: data.senderName, message: data.message, roomId: data.roomId, senderImage: data.senderImage})
    })
})