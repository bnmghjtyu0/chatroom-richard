var express = require("express");
var socket_io = require("socket.io");
var app = express();

var io = socket_io();
app.io = io;

module.exports = function(io) {
  // io stuff here... io.on('conection.....

  io.on("connection", socket => {
    //經過連線後在 console 中印出訊息
    console.log("success connect!");
    //監聽透過 connection 傳進來的事件
    socket.on("getMessage", message => {
      //回傳 message 給發送訊息的 Client
      socket.emit("getMessage", message);
    });
  });
};
