import { Button, Form, Input, message } from 'antd'
import React, {Component} from 'react'
import PubSub from 'pubsub-js'

import { LockOutlined, DownloadOutlined } from '@ant-design/icons';

let service = require('../../../service/tron_service')

export default class PrivateLogin extends Component {
  
  state = {
    privateKey: "",
  }

  // handleCreateClick = () => {
  //     let privateKey = service.newRandomKey()
  //     this.setState({privateKey})
  // }

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
      console.log("开始创建钱包", key)
      service.newWalletFromPrivateKey(key).then(wallets => {
        PubSub.publish("onLoginSucc", wallets)
        this.setState({loading:false})
      }).catch(e => {
          console.log(e)
          message.error("导入出错" + e)
          this.setState({loading:false})
      })
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
        {/* <Form.Item>
          <a href='#' onClick={this.handleCreateClick}>随机生成</a>
        </Form.Item> */}
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