import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import LoginForm from '../login/tron/login'
import Wallet from '../wallet/tron_wallet'

export default class TronHome extends Component {
  state = {
    login: false,
    loading: false,
    loginEvent: '',
    wallets: []
  }

  componentWillMount() {
    let loginEvent = PubSub.subscribe("onLoginSucc", this.onLoginSucc)
    this.setState({loginEvent})
  }

  onLoginSucc = (msg, data) => {
      // console.log("登陆成功")
      // console.log(data)
      this.setState({
          login: true,
          wallets: data
      })
  }

  componentWillUnmount() {
      PubSub.unsubscribe(this.state.loginEvent)
  }

  render() {
    let {login} = this.state
    let content = login ? <Wallet wallets={this.state.wallets}/> : <LoginForm/>
    return (
      content
    )
  }
}
