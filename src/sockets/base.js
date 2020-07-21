"use strict";
var express = require("express");
var socket_io = require("socket.io");
var format = require("morgan").format;
var app = express();
var io = socket_io();
app.io = io;
var formatMessage = function (username, text) {
    return {
        username: username,
        text: text,
        time: 2020,
    };
};
var users = [];
function userJoin(id, username, room) {
    var user = { id: id, username: username, room: room };
    users.push(user);
    return user;
}
function getCurrentUser(id) {
    return users.find(function (user) { return user.id === id; });
}
function userLeave(id) {
    var index = users.findIndex(function (user) { return user.id === id; });
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
function getRoomUsers(room) {
    return users.filter(function (user) { return user.room === room; });
}
var botName = "ChatCord Bot";
module.exports = function (io) {
    // io stuff here... io.on('conection.....
    io.on("connection", function (socket) {
        //經過連線後在 console 中印出訊息
        console.log("success connect!");
        // 登入，加入房間後
        socket.on("joinRoom", function (_a) {
            var username = _a.username, room = _a.room;
            var user = userJoin(socket.id, username, room);
            socket.join(user.room);
            socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));
            socket.broadcast
                .to(user.room)
                .emit("message", formatMessage(botName, user.username + " has joined the chat"));
            // 目前房間內的使用者
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        });
        socket.on("chatMessage", function (message) {
            var user = getCurrentUser(socket.id);
            console.log(user);
            io.in(user.room).emit('message', formatMessage(user.username, message)); //私推 只有相同房間才會收到訊息
            // io.sockets.emit("message", formatMessage(user.username, message)); //廣播推
            // socket.broadcast.emit("getMessageLess", message); //除了自己外所有人收到回傳
        });
        // 離開房間
        socket.on("disconnect", function () {
            var user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit("message", formatMessage(user.username, "A user has left the chat"));
            }
        });
    });
};
