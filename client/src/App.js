import React from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

import webSocket from "socket.io-client";

function App() {
  const [datas, setDatas] = React.useState({});
  const [msg, setMsg] = React.useState("");
  const [socket, setSocket] = React.useState(null);

  const connectWebSocket = () => {
    //開啟
    setSocket(webSocket("/"));
  };

  React.useEffect(() => {
    if (socket) {
      //連線成功在 console 中打印訊息
      console.log("success connect!");
      //設定監聽
      initWebSocket();
    }
  }, [socket]);

  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    socket.on("getMessage", message => {
      console.log(message);
    });
  };

  const sendMessage = e => {
    console.log('send')
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    setTimeout(() => {
      socket.emit("getMessage", "只回傳給發送訊息的 client");
    }, 10000);


    e.preventDefault();
  };

  const asyncHello = async () => {
    const res = await axios.get("/api").then(res => res);
    setDatas(res.data);
  };
  React.useEffect(() => {
    asyncHello();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{datas && datas.title}</p>
        <input type="button" value="連線" onClick={connectWebSocket} />

        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={msg}
            onChange={e => setMsg(e.target.value)}
          />
          <button type="submit">送出</button>
        </form>
      </header>
    </div>
  );
}

export default App;
