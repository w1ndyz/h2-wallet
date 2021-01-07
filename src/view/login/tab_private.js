import { Button, Form, Input } from 'antd'
import React, {Component} from 'react'
import PubSub from 'pubsub-js'

import { LockOutlined, DownloadOutlined } from '@ant-design/icons';

let service = require('../../service/service')

export default class PrivateLogin extends Component {
  
  state = {
    privateKey: "",
  }

  handleCreateClick = () => {
      let privateKey = service.newRandomKey()
      this.setState({privateKey})
  }

  handleChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
  }

  onPrivateLoginClick = () => {
      let key = this.state.privateKey
      let err = service.checkPrivate(key)
      if (err !== "") {
        message.error(err)
        return;
      }
      if (key.substring(0, 2).toLowerCase() !== '0x') {
        key = '0x' + key;
      }
      console.log("开始创建钱包", key)
      let wallets = service.newWalletFromPrivateKey(key)
      if (wallets) {
        PubSub.publish("onLoginSucc", wallets)
      } else {
        message.error("导入出错")
      }
  }

  render() {
    return (
      <Form size="large">
        <Form.Item>
          <Input 
            prefix={<LockOutlined />}
            placeholder="private key"
            value={this.state.privateKey}
            name="privateKey"
            onChange={this.handleChange}
          />
        </Form.Item>
        <Form.Item>
          <a href='#' onClick={this.handleCreateClick}>随机生成</a>
        </Form.Item>
        <br/>
        <br/>
        <br/>
        <Button
          icon={<DownloadOutlined />}
          type="primary" size='large'
          onClick={this.onPrivateLoginClick}>
          私钥导入
        </Button>
      </Form>
    )
  }
}