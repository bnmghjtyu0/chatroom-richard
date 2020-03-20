import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import './App.css';
import './styles/main.scss';
import Home from './pages/home';
import ChatRoom from './pages/chatroom';



function App() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/chatroom">
                <ChatRoom />
            </Route>
        </Switch>
    );
}

export default App;
