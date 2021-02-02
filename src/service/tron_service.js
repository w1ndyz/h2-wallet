import { tron_address } from '../config'
const axios = require('axios')
const Tronweb = require('tronweb')
const HttpProvider = Tronweb.providers.HttpProvider
const fullNode = new HttpProvider(tron_address);
const solidityNode = new HttpProvider(tron_address);
const eventServer = tron_address;

// 默认路径
const PATH_PREFIX="m/44'/195'/0'/0/"

let tronweb = null

// 私钥校验
function checkPrivate(key) {
  if (key === '') {
    return "不能为空"
  }
  if (key.length != 66 && key.length != 64) {
      return false, "秘钥长度必须为66或者64"
  }
  if (!key.match(/^(0x)?([0-9A-fa-f]{64})+$/)) {
      return "秘钥为16进制表示[0-9A-fa-f]"
  }
  return ""
}

// 地址校验
function checkAddress(address) {
  try {
    let realAddress = tronweb.isAddress(address)
    console.log("realaddress",realAddress)
    return realAddress
  } catch (e) {
    return ""
  }
}

// 随机私钥
function newRandomKey() {}

// 获取余额
async function getBalance(address) {
  console.log("aaaaaaaaaaa", address);
  return new Promise(async (resolve, reject) => {
    try {
      let balance = await tronweb.trx.getBalance(address)
      console.log("更新后的balance", balance)
      resolve(tronweb.fromSun(balance))
    } catch (e) {
      reject(e)
    }
  })
}

// 通过私钥创建钱包
function newWalletFromPrivateKey(privateKey) {
    // let wallet = new ethers.Wallet(privateKey)
  tronweb = new Tronweb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
  )

  let address = tronweb.address.fromPrivateKey(privateKey)
  // return wallets
  return new Promise(async (resolve, reject) => {
    let wallets = []
    try {
      let wallet = await tronweb.trx.getAccount(address)
      wallet.address  = tronweb.address.fromHex(wallet.address)
      // wallet.balance = tronweb.fromSun(wallet.balance)
      wallet.privateKey = tronweb.defaultPrivateKey
      // let block = await tronweb.trx.getCurrentBlock()
      // let trasactions = await tronweb.trx.getTransactionFromBlock(block.blockID)
      wallets.push(wallet)
      // wallets.push(trasactions.length)
      resolve(wallets)
    } catch (e) {
      reject(e)
    }
  })
}

// 通过助记词创建钱包
function newWalletFromMmic(mmic, path) {}

// 随机创建钱包
function newRandomWallet() {}

// 校验地址
function checkJsonWallet(data) {}

// 从keystore导入钱包，需要密码
function newWalletFromJson(json, pwd) {}

// 生成助记词
function genMmic() {}

// 连接provider
function connectWallet(wallet, providerurl) {}

// 发送交易
function sendTransaction(to,value) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(tronweb.trx.sendTransaction(to, tronweb.toSun(value)))
    } catch (e) {
      reject(e)
    }
  })
}

function getTransaction(address) {
  return new Promise(async (resolve, reject) => {
    try {
      let columnData = []
      let response = await axios.get(tron_address + '/v1/accounts/' + address + '/transactions')
      let resultData = response.data.data
      for (var i = 0; i < resultData.length; i++){ 
        let key = i
        let hash = interceptAndReplace(resultData[i].signature[0], 1, 4)
        let sendFrom = tronweb.address.fromHex(resultData[i].raw_data.contract[0].parameter.value.owner_address)
        let sendTo = tronweb.address.fromHex(resultData[i].raw_data.contract[0].parameter.value.to_address)
        let type = resultData[i].raw_data.contract[0].type
        let result = resultData[i].ret[0].contractRet
        let tbalance = tronweb.fromSun(resultData[i].raw_data.contract[0].parameter.value.amount)
        let data = {
          key: key,
          hash: hash,
          sendFrom: sendFrom,
          sendTo: sendTo,
          type: type,
          result: result,
          balance: tbalance
        }
        columnData.push(data)
      }
      resolve(columnData)
    } catch (e) {
      reject(e)
    }
  })
}

function interceptAndReplace (str,frontLen,endLen) {
  return str.substring(0,frontLen)+"****"+str.substring(str.length-endLen);
}


export {
  checkPrivate,
  checkAddress,
  newRandomKey,
  newWalletFromPrivateKey,
  newWalletFromMmic,
  newRandomWallet,
  getBalance,
  genMmic,
  newWalletFromJson,
  checkJsonWallet,
  connectWallet,
  sendTransaction,
  getTransaction,
}

