import React from "react";
import PropTypes from "prop-types";
import socketClient from "socket.io-client";
import { useImmer } from "use-immer";

export const useSocket = (serverUrl, topic) => {
  const [messages, setMessages] = useImmer([]);
  const [chatContent, setChatContent] = React.useState(["Hello"]);
  const [isConnected, setConnected] = React.useState(false);
  const [socket, setSocket] = React.useState(null);

  // React.useEffect(() => {
  //   const webSocket = socketClient.connect("/");
  //   setSocket(webSocket);
  // }, []);

  React.useEffect(() => {
    if (socket) {
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
      if (isConnected) {
        initWebSocket();
      }
    }
  }, [socket,serverUrl, isConnected]);

  //設定監聽
  const initWebSocket = () => {
    // //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    // socket.on("getMessage", (message) => {
    //   console.log(message);
    // });
    // // 讓所有人收到回傳
    // socket.on("getMessageAll", (message) => {
    //   console.log(message);
    //   chatContent.push(message);
    //   setChatContent([...chatContent]);
    // });
    // //除了自己外所有人收到回傳
    // socket.on("getMessageLess", (message) => {
    //   console.log(message);
    // });

    // socket.on("chat message", (nick, message) => {
    //   setMessages((draft) => {
    //     draft.push([nick, message]);
    //   });
    // });
    socket.on("message", (message) => {
      console.log("私推");
      console.log(message);
      chatContent.push(message);
      setChatContent([...chatContent]);
    });
  };

  return { socket, chatContent, isConnected };
};
