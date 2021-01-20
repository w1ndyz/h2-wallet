import React, { Component } from 'react'
import { ConfigProvider } from 'antd'
import './App.css';
import Home from './view/home/home'
import EthHome from './view/home/eth_home'
import TronHome from './view/home/tron_home'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component {

  render() {
    return (
        <ConfigProvider>
            <Router>
              <div>
                <Switch>
                  <Route path="/" exact component={Home}></Route>
                  <Route path="/eth" component={EthHome}></Route>
                  <Route path="/trx" component={TronHome}></Route>
                </Switch>
              </div>
            </Router>
        </ConfigProvider>
    );
  }
}


export default App;
