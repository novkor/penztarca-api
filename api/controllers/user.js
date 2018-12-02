'use strict';
var db = require('./db');

db.initUsers('user');


module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  logoutUser: logoutUser,
  getBalance: getBalance
};


function createUser(req, res) {
    var username = req.body.credentials.username;
    var password = req.body.credentials.password;
    var cardnumber = req.body.credentials.cardnumber;
    try{
        var createdUser = db.createUser('user',{username:username,password:password,cardnumber:cardnumber})
        return res.send(201,{id:createdUser});
    } catch (error){
        return res.send(400, {
            message: error.message
        })
    }
}

function loginUser(req, res) {
    try {
        var username = req.body.username;
        var password = req.body.password;
        var obj = db.loginUser('user',{username:username,password:password});
        var sessionId = obj['sessionId'];
        if(!sessionId) {
            return res.send(404, {
                message: "User not found with the given credentials."
            });
        }else {
            return res.send(200, {
                message: "Logged in successfully.",
                sessionId: sessionId
            });
        }
    } catch (error) {
        return res.send(400, {
            message: error.message
        });
    }
}

function logoutUser(req, res) {
    try {
        var ApiKey = req.get('X-session-ID');
        var isAuthenticated = db.isAuthenticated('user',{sessionId:ApiKey});
        if(!isAuthenticated){
            return res.send(401, {
                message: "Authentication error."
            });
        }else {
            db.logoutUser('user',{sessionId:ApiKey});
            return res.send(200, {
                message: 'Logout succesfull.'
            });
        }
    } catch (error) {
        return res.send(400, {
            message: error.message
        });
    }
}

function getBalance(req,res){
    try{
        var ApiKey = req.get('X-session-ID');
        var userId = req.body.replace(/[^A-Za-z0-9\.]+/g, "");
        var isAuthenticated = db.isAuthenticated('user',{sessionId:ApiKey});
        if(!isAuthenticated){
            return res.send(401, {
                message: 'Unauthorized'
            });
        }else {
            
            console.log(userId)
            var getBalance = db.getBalance('cards',{id: userId});
            return res.send(200, {
                balance: getBalance
            });
        }
    } catch (error){
        return res.send(400, {
            message: error.message
        });
    }
}