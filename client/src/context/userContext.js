import React from 'react'

export const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  const [users, setUsers] = React.useState({
    username: '',
    password: '',
    room: ''
  })
  console.log('usercontext', users)
  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
