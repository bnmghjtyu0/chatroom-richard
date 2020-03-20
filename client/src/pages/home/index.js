import React from "react";
import axios from "axios";
import webSocket from "socket.io-client";
import withLayout from "../../components/layout";
import Drawer from "../../components/drawer";

const Home = () => {
  const chatMessageRef = React.useRef(null);
  const loginFormRef = React.useRef(null);
  const [selectRoom, setSelectRoom] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const [userList, setUserList] = React.useState([]);
  const [form, setForm] = React.useState({ msg: "", msgAll: "" });
  const [datas, setDatas] = React.useState({});
  const [chatContent, setChatContent] = React.useState(["Hello"]);
  const asyncHello = async () => {
    const res = await axios.get("/api").then((res) => res);
    console.log(res);
    setDatas(res.data);
  };
  React.useEffect(() => {
    //啟動 socket.io
    setSocket(webSocket("/"));
  }, []);
  React.useEffect(() => {
    asyncHello();
    fetch("/api").then((res) => console.log(res));
  }, []);

  const [socket, setSocket] = React.useState(null);

  //設定監聽
  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    socket.on("message", (message) => {
      console.log("私推");
      console.log(message);
      chatContent.push(message);
      setChatContent([...chatContent]);
    });
  };
  React.useEffect(() => {
    if (socket) {
      //連線成功在 console 中打印訊息
      console.log("success connect!");

      //設定監聽
      initWebSocket();
    }
  }, [socket]);

  const sendMessage = (e) => {
    chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    e.preventDefault();
    // console.log("send");
    // 送出後，清空 input 資料
    console.log(form);
    if (form.msg === "") return false;
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    setTimeout(() => {
      socket.emit("chatMessage", form.msg);
      setForm({ ...form, msg: "" });
    }, 100);
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const onLogin = (e) => {
    e.preventDefault();
    const username = loginFormRef.current.username.value;
    const index = userList.findIndex((user) => user.username === username);
    if (index === -1) {
      socket.emit("joinRoom", { username, room: selectRoom });
      //room iＦnfo
      socket.on("roomUsers", ({ room, users }) => {
        setRoomName(room);
        setUserList(users);
      });
    } else {
      console.log("已經有相同的使用者");
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex  justify-content-center align-items-center">
          <div>
            <Drawer width={"100%"} height={"200px"} />
            <h4> 登入，選擇房間</h4>
            <form ref={loginFormRef} onSubmit={onLogin}>
              <input type="text" name="username" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectRoom("react room");
                }}
              >
                react room
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectRoom("vue room");
                }}
              >
                vue room
              </button>
              <button type="submit">登入</button>
            </form>
            <h4>線上的使用者</h4>
            房間名稱: {roomName.length !== 0 && roomName}
            {userList &&
              userList.map((v, i) => {
                return <div>{v.username}</div>;
              })}
            <h2>歡迎使用 {(datas && datas.title) || "react"} 平台</h2>
            <h4>房間推</h4>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                name="msg"
                value={form.msg}
                onChange={handleForm}
              />
              <button type="submit">送出</button>
            </form>
            <div
              style={{
                height: 200,
                border: "1px solid red",
                overflowY: "scroll",
              }}
              ref={chatMessageRef}
            >
              <ul>
                {chatContent.map((content, contentIdx) => {
                  return (
                    <li>
                      <span>{content.username}</span>
                      <span>{content.time}</span>
                      <span>{content.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(Home);
