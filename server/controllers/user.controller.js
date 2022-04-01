const {User} = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

require('dotenv').config();

const mySecretKey = process.env.SECRET_KEY
const generateToken = id => {
    return jwt.sign( { id }, mySecretKey, {expiresIn: "2d"} )
}
// module.exports.login = (req, res) => {
//     console.log("Running...");
//     console.log("SEcret key: ",mySecretKey);
//     const { email, password } = req.body;
//     //Find (or don't) user from the db using emai
//     const user = User.findOne({email})
//         .then(user => {
//             if(user === null){
//                 //User wasn't in db
//                 res.status(400).json({message: "Incorrect Email"})
//             } else {
//                 //Check to see if password was incorrect
//                 bcrypt.compare(password, user['password'])
//                     .then(isValid => {
//                         if(!isValid){
//                             return res.status(400).json({message:"Incorrect password"});
//                         } else {
//                             res.cookie("usertoken", jwt.sign({_id: user._id}, mySecretKey), {httpOnly: true})
//                                 .json({message: "Success"})
//                         }
//                     })
//                     .catch()
//             }
//         })
// }


module.exports.login = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if(user === null) {
        // email not found in users collection
        return res.status(400).json("Incorrect Email");
    }

    // if we made it this far, we found a user with this email address
    // let's compare the supplied password to the hashed password in the database
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    if(!correctPassword) {
        // password wasn't a match!
        return res.status(400).json("Incorrect Password");
    }

    // if we made it this far, the password was correct
    res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastname: user.lastName,
        token: generateToken(user._id)
    })
}

module.exports.getLoggedInUser = (req, res) => {
    const decodedJWT = jwt.decode(req.body.localStorage, {complete: true})
    User.findById(decodedJWT.payload.id)
        .then(response => res.json(response))
        .catch(err => res.json(err))
}


//Register function
module.exports.registerUser = async (req, res) => {
    const {firstName, lastName, username, email, password, confirmPassword} = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({errors: {email: {message: "Email already exists"}}});

    User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    })
    .then( newUser => {
        res.status(201).json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            token: generateToken(newUser._id)
        })
        
    })
    .catch( err => res.status(400).json(err))
}

module.exports.getAllUsers = (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err));
}

module.exports.getSingleUser = (req, res) => {
    User.findOne({_id: req.params._id})
        .then(user => res.json(user))
        .catch(err => res.json(err));
}

module.exports.getUserByEmail = (req, res) => {
    console.log("Runing");
    User.findOne({email: req.params.email})
        .then(user => {
            res.json(user)
        })
        .catch(err => res.json(err))
}

module.exports.updateUser = (req, res) => {
    const {email, imageUrl} = req.body;
    const updatedUserObj = {
        email: email,
        imageUrl: imageUrl
    }
    User.findOneAndUpdate({_id: req.params._id}, updatedUserObj, {runValidators: true, new: true})
        .then(updatedUser => {
            res.json(updatedUser)
        })
        .catch(err => res.json(err));
}

module.exports.addRoom = (req, res) => {
    console.log(req.body);
    const {_id, name} = req.body;
    User.updateOne({_id: req.params._id}, { $push: {rooms: {_id: _id, name: name}}})
        .then(response => res.json(response))
        .catch(err => res.json(err));
}

module.exports.deleteUser = (req, res) => {
    const {_id} = req.params;
    User.deleteOne({_id: _id})
        .then(deletedUser => res.json(deletedUser))
        .catch(err => res.json(err));
}

// module.exports.deleteAll = (req, res) => {
//     User.deleteMany({})
//         .then(deletedUsers => res.json(deletedUsers))
//         .catch(err => res.json(err));
// }