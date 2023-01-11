const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

let users = [];
app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
socketIO.on('connection', (socket) => {
    console.log(`ok:${socket.id} user just connected`);
    //Listen Message
    socket.on('message', (data) => {
        console.log(data);
    })
    //Listens when a new user joins the server
    socket.on('newUser', (data) => {
        users.push(data);
        socketIO.emit('newUserResponse', users)
    })
    //send the message to all the uses on the server
    socket.on('message', (data) => {
        socketIO.emit('messageResponse',data);
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('typingResponse',data);
    })

    socket.on('disconnected',()=>{
        console.log('d:A user disconnected');
        //updates the list of users when a user disconnectd
        users = users.filter((user) => user.socketID !== socket.id);
        socketIO.emit('newUserResponse',users);
        socket.disconnect();
    });
    
});

//testing



http.listen(4000,()=> `Sever os running on Port 3000`)
