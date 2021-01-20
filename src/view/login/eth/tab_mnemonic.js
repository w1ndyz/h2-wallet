import { Button, Form, Input } from 'antd'
import PubSub from 'pubsub-js'
import React, {Component} from 'react'

import { UserOutlined, BookOutlined } from '@ant-design/icons';

const { TextArea } = Input;

let service = require('../../../service/eth_service')

export default class MmicLogin extends Component {

  state = {
      privateKey: "",
      mmic: "",
      pwd: "",
      path: "m/44'/60'/0'/0/0",
  }
  // 处理输入文本绑定
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  // 生成助记词
  handleGenMicc = () => {
      let mmic = service.genMmic()
      this.setState({mmic})
  }

  // 助记词导入
  onMMICClick = () => {
      let {mmic, path} = this.state
      let wallets = service.newWalletFromMmic(mmic, path)
      PubSub.publish("onLoginSucc", wallets)
  }

  render() {
    return (
      <Form size="large">
        <Form.Item>
          <TextArea 
            rows={4} 
            placeholder="12 words" 
            name="mmic"
            value={this.state.mmic}
            onChange={this.handleChange}
          />
        </Form.Item>
        <Form.Item>
          <Input 
            prefix={<UserOutlined />}
            placeholder="private key"
            type="path"
            value={this.state.path}
            readOnly
          />
        </Form.Item>
        <Form.Item>
          <a onClick={this.handleGenMicc}>随机生成</a>
        </Form.Item>
        <Button
          icon={<BookOutlined/>}
          type="primary" size='large'
          onClick={this.onMMICClick}
        >
          助记词导入
        </Button>
      </Form>
    )
  }
}
