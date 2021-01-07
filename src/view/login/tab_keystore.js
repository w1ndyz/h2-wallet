import { Button, Form, Input, message } from 'antd'
import PubSub from 'pubsub-js'
import React, {Component} from 'react'

import { LockOutlined, KeyOutlined } from '@ant-design/icons'

let service = require('../../service/service')

const { TextArea } = Input;

export default class KeyStoreLogin extends Component {

  state = {
      keyStore: "",
      pwd: "",
      loading: false
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  // 处理导入
  handleKeyImport = () => {
      let {keyStore, pwd} = this.state
      if (keyStore==""){
          return
      }
      console.log(service.checkJsonWallet(keyStore))
      this.setState({loading:true})
      service.newWalletFromJson(keyStore, pwd).then(wallets => {
          PubSub.publish("onLoginSucc", wallets)
          this.setState({loading:false})
      }).catch(e => {
          console.log(e)
          message.error("导入出错" + e)
          this.setState({loading:false})
      })
  }

  onFileChooseClick = ()=>{}

  render() {
    return (
      <Form size="large">
        <Form.Item>
          <TextArea 
            rows={4} 
            placeholder="keystore为json格式" 
            name="keyStore"
            value={this.state.keyStore}
            onChange={this.handleChange}
          />
        </Form.Item>
        <Form.Item>
          <Input 
            prefix={<LockOutlined />}
            placeholder="password"
            type="password"
            name="pwd"
            value={this.state.pwd}
            onChange={this.handleChange}
          />
        </Form.Item>
        <Button
          icon={<KeyOutlined/>}
          type="primary" size='large'
          onClick={this.handleKeyImport}
        >
          KeyStore导入
        </Button>
      </Form>
    )
}
}