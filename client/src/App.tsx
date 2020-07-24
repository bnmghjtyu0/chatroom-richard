import React, { FunctionComponent } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
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
const PrivateRoute: React.FC<Props> = (props) => {
  const { layout: Layout, component: Component, ...rest } = props
  return (
    <Route
      {...rest}
      render={(matchProps: any) =>
        localStorage.getItem('username') ? (
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
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <PrivateRoute component={Home} exact layout={MainLayout} path="/" />
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
