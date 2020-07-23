import React, { FunctionComponent } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { Minimal as MinimalLayout } from './layouts'
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
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
