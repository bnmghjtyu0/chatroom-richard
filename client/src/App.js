import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
    const [datas, setDatas] = React.useState({});
    const asyncHello = async () => {
        const res = await axios.get('/api').then(res => res);
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
            </header>
        </div>
    );
}

export default App;
