import React from "react";
import webSocket from "socket.io-client";
import withLayout from "../../components/layout";
import { FormGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
const ChatRoom = () => {
  const [chatPeople, setChatPeople] = React.useState([
    {
      name: "Richard",
      msg: "Hi,Jordan I Feels like it's ~",
      time: "2min",
      msgNum: 2,
      profilePic:
        "https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg",
    },
  ]);
  const [socket, setSocket] = React.useState(null);
  const chatMessageRef = React.useRef(null);
  const loginFormRef = React.useRef(null);
  const [selectRoom, setSelectRoom] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const [userList, setUserList] = React.useState([]);
  const [form, setForm] = React.useState({ msg: "", msgAll: "" });
  const [chatContent, setChatContent] = React.useState(["Hello"]);
  const [isLogin, setIsLogin] = React.useState(false);
  const [loginUser, setLoginUser] = React.useState({ username: "" });
  React.useEffect(() => {
    //啟動 socket.io
    setSocket(webSocket("/"));
  }, []);
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
    e.preventDefault();
    chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
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
      setLoginUser({ username: username });
      setIsLogin(true);

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

  const ChatList = ({ person, title }) => {
    console.log(title);
    return (
      <li>
        <div className="chat-list-card active">
          <div
            className="profile-picture-sm"
            style={{
              backgroundImage: `url('https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg')`,
            }}
          />
          <div className="chat-list-card-name">
            <h4>{person.username}</h4>
            {/* <p>{person.msg}</p> */}
          </div>
          <div className="chat-list-card-info">
            <span className="d-block chat-time">{/* {person.time} */}</span>
            <span className="badge badge-warning">{/* {person.msgNum} */}</span>
          </div>
        </div>
      </li>
    );
  };
  return (
    <React.Fragment>
      <Button variant="contained" color="primary">
        你好，世界
      </Button>
      <div className="main-head d-flex">
        <div className="main-head-left mr-auto">
          <h1 className="logo">Charming Platform</h1>
        </div>
      </div>
      <div className="main-search form-inline">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              @
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <div className="main-body d-flex">
        <div id="chat-people" className="main-body-left">
          <div className="chat-people">
            {loginUser.username.length === 0 ? null : loginUser.username}
            <h4>線上使用者</h4>
            <ul className="chat-list scrollbar-style1">
              {userList &&
                userList.map((person, i) =>
                  person.username === loginUser.username ? null : (
                    <ChatList person={person} />
                  )
                )}
            </ul>
            <ul className="chat-list scrollbar-style1">
              {chatPeople &&
                chatPeople.map((person, personIdx) => {
                  console.log(person);
                  return (
                    <li>
                      <div className="chat-list-card active">
                        <div
                          className="profile-picture-sm"
                          style={{
                            backgroundImage: `url(${person.profilePic})`,
                          }}
                        />
                        <div className="chat-list-card-name">
                          <h4>{person.name}</h4>
                          <p>{person.msg}</p>
                        </div>
                        <div className="chat-list-card-info">
                          <span className="d-block chat-time">
                            {person.time}
                          </span>
                          <span className="badge badge-warning">
                            {person.msgNum}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="main-body-right">
          {isLogin ? null : (
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
          )}

          <div className="chat-room">
            <div className="chat-room-head">
              {roomName.length === 0 ? null : (
                <div className="chat-room-head-left">
                  <div
                    className="profile-picture-lg"
                    style={{
                      backgroundImage:
                        "url('https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg')",
                    }}
                  />
                  <div className="chat-room-head-name">
                    <h4>{roomName}</h4>
                  </div>
                </div>
              )}
              <div className="chat-room-head-right">
                <div className="dropdown">
                  <button
                    className="btn"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="gg-more-vertical-alt" />
                  </button>

                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="chat-room-window"
              style={{
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
              }}
              ref={chatMessageRef}
            >
              {chatContent.map((content, contentIdx) => {
                if (content.username === "ChatCord Bot") {
                  return (
                    <div style={{ textAlign: "center" }}>
                      <span>{content.text}</span>
                    </div>
                  );
                }
                if (content.username === loginUser.username) {
                  // 自己
                  return (
                    <div
                      style={{
                        background: "#4545a5",
                        width: "50%",
                        marginLeft: "auto",
                        padding: 12,
                        marginTop: 12,
                        marginBottom: 12,
                        color: "#fff",
                        borderRadius: 6,
                        display: "flex",
                      }}
                    >
                      <span>{content.text}</span>
                      <div style={{ marginLeft: "auto" }}>
                        <span>{content.username}</span>
                        {/* <span>{content.time}</span> */}
                      </div>
                    </div>
                  );
                } else {
                  // 其他人
                  return (
                    <div
                      style={{
                        background: "#fff",
                        width: "50%",
                        marginRight: "auto",
                        padding: 12,
                        marginTop: 12,
                        marginBottom: 12,
                        color: "#333",
                        borderRadius: 6,
                        display: "flex",
                      }}
                    >
                      <span>{content.text}</span>
                      <div style={{ marginLeft: "auto" }}>
                        <span>{content.username}</span>
                        {/* <span>{content.time}</span> */}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <div className="chat-room-foot">
              <form onSubmit={sendMessage}>
                <div className="input-group mb-3">
                  <Button variant="contained" color="primary" disableElevation>
                    @
                  </Button>
                  <TextField
                    name="msg"
                    id="outlined-multiline-static"
                    label="message..."
                    multiline
                    rows={4}
                    defaultValue="Default Value"
                    variant="outlined"
                    value={form.msg}
                    onChange={handleForm}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disableElevation
                  >
                    送出
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withLayout(ChatRoom);
