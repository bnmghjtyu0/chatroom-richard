import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import UserProvider, { UserContext } from './context/userContext'
import { Minimal as MinimalLayout, Main as MainLayout } from './layouts'
import theme from './theme'
import './App.css'
import './styles/main.scss'
import Home from './pages/home'
import SignIn from './pages/SignIn'

type Props = {
  component: any
  exact: boolean
  layout: FunctionComponent
  path: string
}
type PrivateProps = Props & {
  isLogin: boolean
}
const RouteWithLayout: FunctionComponent<Props> = (props) => {
  const { layout: Layout, component: Component, ...rest } = props

  return (
    <Route
      {...rest}
      render={(matchProps: any) => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  )
}
const PrivateRoute: React.FC<PrivateProps> = (props) => {
  const {
    layout: Layout,
    component: Component,
    isLogin,
    ...rest
  } = props
  return (
    <Route
      {...rest}
      render={(matchProps: any) =>
        isLogin ? (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: '/signin'
            }}
          />
        )
      }
    />
  )
}

function App() {
  const { users, setUsers } = React.useContext(UserContext)
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <PrivateRoute
          component={Home}
          exact
          layout={MainLayout}
          path="/"
          isLogin={users.username !== ''}
        />
        <RouteWithLayout
          component={SignIn}
          exact
          layout={MinimalLayout}
          path="/signin"
        />
      </Switch>
    </ThemeProvider>
  )
}

export default App
