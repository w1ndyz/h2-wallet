import React, {Component} from 'react'
import { 
  Layout, 
  PageHeader, 
  Card, 
  Row, 
  Col, 
  Spin, 
  Form, 
  Input,
  Button,
  message,
  Table,
} from 'antd'
import { eth_address } from '../../config'
import { MoneyCollectOutlined, IdcardOutlined, SwapOutlined, LockOutlined } from '@ant-design/icons';

let ethers = require('ethers')
let service = require('../../service/eth_service')
let fileSaver = require('file-saver');

let columnData
const columns = [
  {
    title: '哈希',
    dataIndex: 'hash',
    key: 'hash',
  },
  {
    title: '发送人',
    dataIndex: 'sendFrom',
    key: 'sendFrom',
  },
  {
    title: '接收人',
    dataIndex: 'sendTo',
    key: 'sendTo',
  },
  {
    title: '区块号码',
    dataIndex: 'blockNumber',
    key: 'blockNumber',
  },
  {
    title: 'Age',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: '数额',
    dataIndex: 'balance',
    key: 'balance',
  },
  {
    title: '手续费',
    dataIndex: 'gasPrice',
    key: 'gasPrice',
  },
]

const tailLayout = {
  wrapperCol: { offset: 0, span: 48 },
};

export default class Wallet extends Component {

  state = {
      wallets: [],// 支持多账户，默认第0个
      selectWallet: 0,
      provider: eth_address, //环境
      walletInfo: [], // 钱包信息，获取为异步，单独存储下
      activeWallet: {}, // 当前活跃钱包
      txto: "", // 交易接收地址
      txvalue: "", // 转账交易金额
      pwd: "", // 导出keystore需要密码

      // UI状态表示
      txPositive: false, //
      loading: false,
      exportLoading: false,

  }

  constructor(props) {
    super(props)
    this.state.wallets = props.wallets
    this.state.selectWallet = props.wallets.length == 0 ? -1 : 0
}

// 更新钱包信息
updateActiveWallet() {
    if (this.state.wallets.length == 0) {
        return null
    }
    let activeWallet = this.getActiveWallet()
    this.setState({activeWallet})
    this.loadActiveWalletInfo(activeWallet)
    return activeWallet
}

// 获取当前的钱包
getActiveWallet() {
    let wallet = this.state.wallets[this.state.selectWallet]
    // 激活钱包需要连接provider
    return service.connectWallet(wallet, this.state.provider)
}

// 加载钱包信息
async loadActiveWalletInfo(wallet) {
    let address = await wallet.getAddress()
    let balance = await wallet.getBalance()
    // 获取交易次数
    let tx = await wallet.getTransactionCount()
    // console.log(address, balance, tx);
    columnData = await service.getHistoryTransaction(address)
    this.setState({
        walletInfo: [address, balance, tx]
    })
}

// 发送交易
onSendClick = () => {
  let {txto, txvalue, activeWallet} = this.state
  // balance 为Object类型

  // console.log("balance", activeWallet)
  // 地址校验
  let address = service.checkAddress(txto)
  if (address == "") {
    message.error("地址不正确")
    return 
  }
  // console.log(txvalue, isNaN(txvalue))
  if (isNaN(txvalue)) {
    message.error("转账金额不合法")
    return
  }
  // 以太币转换，发送wei单位
  txvalue = ethers.utils.parseEther(txvalue);
  // console.log("txvalue", txvalue)

  // 设置加载loading，成功或者识别后取消loading
  this.setState({loading: true})

  service.sendTransaction(activeWallet, txto, txvalue)
      .then(tx => {
          // console.log(tx)
          message.success("交易成功")
          this.updateActiveWallet()
          this.setState({loading: false, txto: "", txvalue: ""})
      })
      .catch(e => {
          this.setState({loading: false})
          console.log(e);
          message.error(e);
      })
  }

  // 查看私钥
  onExportPrivate = () => {
    message.info(this.getActiveWallet().privateKey)
  }
  // 导出keystore
  onExportClick = () => {
      let pwd = this.state.pwd;
      if (pwd.length < 8) {
        message.error("密码长度不能小于8")
        return
      }
      this.setState({exportLoading: true})
      // 通过密码加密
      this.getActiveWallet().encrypt(pwd, false).then(json => {
          let blob = new Blob([json], {type: "text/plain;charset=utf-8"})
          fileSaver.saveAs(blob, "keystore.json")
          this.setState({exportLoading: false})
      });
  }

  // 页面加载完毕，更新钱包信息
  componentDidMount() {
      this.updateActiveWallet()
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    // 金额显示需要手工转换
    let wallet = this.state.walletInfo
    // console.log("wallet>:", wallet);
    if (wallet.length == 0) {
        return <Spin size="large" tip="loading..."/>
    }
    let balance = wallet[1]
    let balanceShow = ethers.utils.formatEther(balance) + "(" + balance.toString() + ")"
    return (
      <Layout style={{ background: '#fff' }}>
        <PageHeader 
          title="以太坊氢钱包"
          avatar={{ src: 'images/ethereum.png', width: "50px", height:"50px" }}
        />
        <div className="site-card-wrapper">
          <Row gutter={[16, 16]} type="flex" justify="center">
            <Col span={10}>
              <Card title="钱包账户" bordered={false}>
                <Form size="large">
                  <Form.Item>
                    <Input 
                      prefix={<IdcardOutlined />}
                      value={wallet[0]}
                      addonBefore="地址"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input 
                      prefix={<MoneyCollectOutlined />}
                      value={balanceShow}
                      addonBefore="余额"
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input 
                      prefix={<SwapOutlined />}
                      value={wallet[2]}
                      addonBefore="交易"
                      readOnly
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="center">
            <Col span={10}>
              <Card title="钱包账户" bordered={false}>
                <Form size="large">
                  <Form.Item>
                    <Input 
                      prefix={<IdcardOutlined />}
                      addonBefore="地址"
                      placeholder="对方地址"
                      type='text'
                      name='txto'
                      value={this.state.txto}
                      onChange={this.handleChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input 
                      prefix={<MoneyCollectOutlined />}
                      addonBefore="金额"
                      placeholder="eth"
                      type='text'
                      name='txvalue'
                      value={this.state.txvalue}
                      onChange={this.handleChange}
                    />
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Col style={{ width: 100 }}>
                      <Button
                        loading={this.state.loading}
                        onClick={this.onSendClick}
                        type="primary" size='large'
                        style={{ width: 100 + '%' }}
                      >
                        确认
                      </Button>
                    </Col>

                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" justify="center">
            <Col span={10}>
              <Card title="设置" bordered={false}>
              <Form size="large">
                  <Form.Item>
                    <Input 
                      prefix={<LockOutlined />}
                      addonBefore="密码"
                      placeholder="密码"
                      type='password'
                      name='pwd'
                      value={this.state.pwd}
                      onChange={this.handleChange}
                    />
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button
                      onClick={this.onExportPrivate}
                      type="primary" size='large'
                    >
                      查看私钥
                    </Button>
                    <Button
                      loading={this.state.exportLoading}
                      onClick={this.onExportClick}
                      type="primary" size='large'
                      style={{ marginLeft: 15 + 'px' }}
                    >
                      KeyStore导出
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
        <Table columns={columns} dataSource={columnData} />
      </Layout>
    )
  }
}