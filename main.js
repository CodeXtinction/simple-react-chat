var express = require('express');
var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var open = require('open');

var serverPort = (process.env.PORT  || 8080);

var app = express();
var server = http.createServer(app);
var websocket = io(server);

server.listen(serverPort, ()=>{
    console.log(`server running at ${serverPort}`);
    if (process.env.LOCAL) {
        open('https://localhost:' + serverPort)
    }
});


var clients = [];

var messages = [
    {"message":"Comienza a cheatear!", "user":"Servidor"},
    ];



websocket.on('connection', (socket) => {
    //clients.push(socket.id);
    //socket.emit('users', users);
    socket.emit('messages', messages);
    socket.emit('lista', clients);
    socket.on('join', (data) => {
        console.log(`cliente conectado ${data}`);
        clients.push(data);
        websocket.sockets.emit('lista', clients);
        socket.on('disconnect', function() {
            console.log(`cliente desconecatado ${data}`);
            var i = clients.indexOf(data);
            clients.splice(i, 1);
            websocket.sockets.emit('lista', clients);
        });
    });
    socket.on('send', (msg) => {
        messages.push(msg);
        websocket.sockets.emit('messages', messages);
    })
});
