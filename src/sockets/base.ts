var express = require("express");
var socket_io = require("socket.io");
const { format } = require("morgan");
var app = express();

var io = socket_io();
app.io = io;

const formatMessage = (username: string, text: string) => {
  return {
    username,
    text,
    time: 2020,
    // time: moment().format("h:mm:a"),
  };
};

type User = {
  id: number,
  username: string,
  room: string
}

type Users = User[]


const users: Users = [];

function userJoin(id: number, username: string, room: string) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id: number): User {
  return users.find((user) => user.id === id);
}

function userLeave(id: number) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room: string) {
  return users.filter((user) => user.room === room);
}

const botName = "ChatCord Bot";

module.exports = function (io: any) {
  // io stuff here... io.on('conection.....

  io.on("connection", (socket: any) => {
    //經過連線後在 console 中印出訊息
    console.log("success connect!");
    // 登入，加入房間後
    socket.on("joinRoom", ({ username, room }: User) => {
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);

      socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has joined the chat`)
        );
      // 目前房間內的使用者
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

    socket.on("chatMessage", (message: string) => {
      const user: User = getCurrentUser(socket.id);
      io.in(user.room).emit('message', formatMessage(user.username, message));//私推 只有相同房間才會收到訊息
      // io.sockets.emit("message", formatMessage(user.username, message)); //廣播推
      // socket.broadcast.emit("getMessageLess", message); //除了自己外所有人收到回傳
    });

    // 離開房間
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(user.username, "A user has left the chat")
        );
      }
    });
  });
};
