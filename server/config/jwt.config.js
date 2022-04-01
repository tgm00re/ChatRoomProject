const jwt = require('jsonwebtoken');
require('dotenv').config();

const mySecretKey = process.env.SECRET_KEY

module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.body.localStorage, mySecretKey, (err, payload) => {
        if(err){
            res.status(401).json({verified: false})
        } else{
            next();
        }
    })
}