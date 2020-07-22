import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";
import theme from "./theme";
import "./App.css";
import "./styles/main.scss";
import Home from "./pages/home";
import ChatRoom from "./pages/chatroom";
import SignIn from "./pages/SignIn";

const RouteWithLayout = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

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
        <Route path="/chatroom">
          <ChatRoom />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
