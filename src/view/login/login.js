import React,{Component} from 'react'
import { Layout , PageHeader, Tabs, Row, Col} from 'antd'

import PrivateLogin from "./tab_private"
import MnemonicLogin from "./tab_mnemonic"
import KeyStoreLogin from './tab_keystore'

const { TabPane } = Tabs;

export default class Login extends Component {

  render() {
      return (
        <Layout style={{ background: '#fff' }}>
          <PageHeader 
            title="氢钱包"
            avatar={{ src: 'images/ethereum.png', width: "50px", height:"50px" }}
          />
          <Row type="flex" justify="center" align="middle" style={{minHeight:'50vh'}}>
            <Col span={12}>
              <Tabs>
                <TabPane tab="私钥" key="1">
                  <PrivateLogin />
                </TabPane>
                <TabPane tab="助记词" key="2">
                  <MnemonicLogin />
                </TabPane>
                <TabPane tab="KeyStore" key="3">
                  <KeyStoreLogin />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Layout>
          
      )
  }
}