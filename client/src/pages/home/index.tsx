/** @jsx jsx */
import React, { ReactEventHandler } from 'react'
import io from 'socket.io-client'
import {
  FormGroup,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Paper,
  Avatar
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import { css, jsx } from '@emotion/core'
import { withRouter, RouteComponentProps } from 'react-router'
import { History } from 'history'
import clsx from 'clsx'
import Icon from '@material-ui/core/Icon'

const RsButton = styled(Button)`
  background-color: red;
  &:hover {
    background: green;
  }
`

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: 0
  },
  textField: {}
}))

type ChatPeopleProps = {
  msg?: string
  msgNum?: number
  name: string
  profilePic?: string
  time?: string
  username?: string
  text?: string
}[]
type MessageProps = {
  username: string
  text: string
  time: number
}

type RoomUserProps = {
  room: string
  users: {
    username: string
  }[]
}

type LocationProps = {
  state: {
    detail?: {
      username: string
      room: string
    }
  }
}

interface ChildComponentProps {
  history: History
  /* other props for ChildComponent */
}

type SomeComponentProps = RouteComponentProps<any>

const HomeScreen: React.FC<any> = ({ history }) => {
  const classes = useStyles()
  const location = history.location
  // location.state?.detail?.username
  const [chatPeople, setChatPeople] = React.useState<ChatPeopleProps>([
    {
      name: 'Richard',
      msg: "Hi,Jordan I Feels like it's ~",
      time: '2min',
      msgNum: 2,
      profilePic:
        'https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg'
    }
  ])

  const [searchText, setSearchText] = React.useState('')
  // const [socket, setSocket] = React.useState()
  const chatMessageRef = React.useRef<HTMLDivElement>(
    document.createElement('div')
  )
  const loginFormRef = React.useRef<HTMLFormElement>(
    document.createElement('form')
  )
  const [selectRoom, setSelectRoom] = React.useState('')
  const [roomName, setRoomName] = React.useState('')
  const [userList, setUserList] = React.useState([{ username: '' }])
  const [form, setForm] = React.useState({ msg: '', msgAll: '' })
  const [chatContent, setChatContent] = React.useState([
    { username: '', text: '' }
  ])
  const [isLogin, setIsLogin] = React.useState(false)
  const [loginUser, setLoginUser] = React.useState({ username: '' })
  const [isConnected, setConnected] = React.useState(false)
  const [socket, setSocket] = React.useState<any>(null)
  React.useEffect(() => {
    const webSocket = io('/')
    setSocket(webSocket)
  }, [])

  React.useEffect(() => {
    //  啟動 socket.io
    if (socket) {
      socket.on('connect', () => setConnected(true))
      socket.on('disconnect', () => setConnected(false))
      if (isConnected) {
        console.log('以連線')
        initWebSocket()
      }
    }
  }, [socket, isConnected])
  //設定監聽
  const initWebSocket = () => {
    addRoom(location.state?.detail?.username, location.state?.detail?.room)
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    socket.on('message', (message: MessageProps) => {
      console.log('私推')
      console.log(message)
      setChatContent((prevState) => [...prevState, message])
    })
  }

  const sendMessage = (e: any) => {
    e.preventDefault()
    chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight
    // console.log("send");
    // 送出後，清空 input 資料
    console.log(form)
    if (form.msg === '') return false
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    setTimeout(() => {
      socket.emit('chatMessage', form.msg)
      setForm({ ...form, msg: '' })
    }, 100)
  }

  const handleForm = (e: any) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const addRoom = (username: string, room: string) => {
    console.log('aaddd')
    setLoginUser({ username: username })
    setIsLogin(true)

    socket.emit('joinRoom', { username, room: room })
    //room iＦnfo
    socket.on('roomUsers', ({ room, users }: RoomUserProps) => {
      setRoomName(room)
      setUserList(users)
    })
  }
  const onLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const username = loginFormRef.current.username.value

    const index = userList.findIndex((user) => user.username === username)
    if (index === -1) {
      setLoginUser({ username: username })
      setIsLogin(true)

      socket.emit('joinRoom', { username, room: selectRoom })
      //room iＦnfo
      socket.on('roomUsers', ({ room, users }: RoomUserProps) => {
        setRoomName(room)
        setUserList(users)
      })
    } else {
      console.log('已經有相同的使用者')
    }
  }

  type ChatListProps = {
    person: {
      username: string
    }
  }
  const ChatList = ({ person }: ChatListProps) => {
    return (
      <li>
        <div className="chat-list-card active">
          <div
            className="profile-picture-sm"
            style={{
              backgroundImage: `url('https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg')`
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
    )
  }
  return (
    <React.Fragment>
      <div className="main-head d-flex">
        <div className="main-head-left mr-auto">
          <h1 className="logo">Charming Platform</h1>
        </div>
      </div>
      <div className="main-search form-inline">
        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Icon
                  css={css`
                    font-size: 20px;
                  `}>
                  search
                </Icon>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            // inputProps={{
            //   'aria-label': 'weight'
            // }}
            labelWidth={0}
          />
        </FormControl>
      </div>
      <div className="main-body d-flex">
        <div id="chat-people" className="main-body-left">
          <h4 className="mb-4">自己</h4>
          <div className="chat-people mb-5">
            {Object.keys(loginUser).length === 0 ? null : (
              <div className="chat-list-card active">
                <div
                  className="profile-picture-sm"
                  style={{
                    backgroundImage: `url('https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg')`
                  }}
                />
                <div className="chat-list-card-name">
                  <h4>{loginUser.username}</h4>
                  {/* <p>{person.msg}</p> */}
                </div>
                <div className="chat-list-card-info">
                  <span className="d-block chat-time">
                    {/* {person.time} */}
                  </span>
                  <span className="badge badge-warning">
                    {/* {person.msgNum} */}
                  </span>
                </div>
              </div>
            )}
            <h4 className="mt-3">線上使用者</h4>
            <ul className="chat-list scrollbar-style1">
              {userList &&
                userList.map((person, i) =>
                  person.username === loginUser.username ? null : (
                    <ChatList person={person} />
                  )
                )}
            </ul>
            {/* <ul className="chat-list scrollbar-style1">
              {chatPeople &&
                chatPeople.map((person, personIdx) => {
                  console.log(person)
                  return (
                    <li>
                      <div className="chat-list-card active">
                        <div
                          className="profile-picture-sm"
                          style={{
                            backgroundImage: `url(${person.profilePic})`
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
                  )
                })}
            </ul> */}
          </div>
        </div>
        <div className="main-body-right">
          {isLogin ? null : (
            <form ref={loginFormRef} onSubmit={onLogin}>
              <input type="text" name="username" />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectRoom('react room')
                }}>
                react room
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectRoom('vue room')
                }}>
                vue room
              </button>
              <button type="submit">登入</button>
            </form>
          )}

          <div className="chat-room">
            <div className="chat-room-head">
              {roomName === '' ? null : (
                <div className="chat-room-head-left">
                  <div
                    className="profile-picture-lg"
                    style={{
                      backgroundImage:
                        "url('https://i.pinimg.com/originals/2e/2f/ac/2e2fac9d4a392456e511345021592dd2.jpg')"
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
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="gg-more-vertical-alt" />
                  </button>

                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink">
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
            <div className="chat-room-window mb-5" ref={chatMessageRef}>
              {chatContent.map((content, contentIdx) => {
                if (content.username === 'ChatCord Bot') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <span>{content.text}</span>
                    </div>
                  )
                }
                if (content.username === loginUser.username) {
                  // 自己
                  return (
                    <div className="d-flex align-items-end">
                      <div
                        style={{
                          background: '#4545a5',
                          width: '70%',
                          marginLeft: 'auto',
                          padding: 20,
                          marginTop: 26,
                          color: '#fff',
                          borderRadius: 6,
                          display: 'flex'
                        }}>
                        <div
                          dangerouslySetInnerHTML={{ __html: content.text }}
                        />
                        <div style={{ marginLeft: 'auto' }}>
                          <span>{content.username}</span>
                          {/* <span>{content.time}</span> */}
                        </div>
                      </div>
                      <Avatar
                        alt={content.username}
                        src="/static/images/avatar/1.jpg"
                        css={css`
                          margin-left: 10px;
                        `}
                      />
                    </div>
                  )
                } else {
                  // 其他人
                  return (
                    <div className="d-flex align-items-end">
                      <Avatar
                        alt={content.username}
                        src="/static/images/avatar/1.jpg"
                        css={css`
                          margin-right: 10px;
                        `}
                      />
                      <div
                        style={{
                          background: '#fff',
                          width: '70%',
                          marginRight: 'auto',
                          padding: 20,
                          marginTop: 26,
                          color: '#333',
                          borderRadius: 6,
                          display: 'flex'
                        }}>
                        <span>{content.text}</span>
                        <div style={{ marginLeft: 'auto' }}>
                          <span>{content.username}</span>
                          {/* <span>{content.time}</span> */}
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
            <div className="chat-room-foot">
              <form onSubmit={sendMessage}>
                <div className="input-group mb-3 align-items-end flex-nowrap">
                  <TextField
                    name="msg"
                    id="outlined-multiline-static"
                    label="輸入訊息"
                    multiline
                    defaultValue="Default Value"
                    variant="outlined"
                    size="medium"
                    rowsMax={4}
                    value={form.msg}
                    onChange={handleForm}
                    style={{ marginRight: 20 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disableElevation>
                    送出
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default withRouter(HomeScreen)
