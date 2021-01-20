let tronweb = require('tronweb')

// 默认路径
const PATH_PREFIX="m/44'/195'/0'/0/"

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
  // try {
  //   let realAddress = ethers.utils.getAddress(address)
  //   console.log("realaddress",realAddress)
  //   return realAddress
  // }catch (e) {
  //     return ""
  // }
}

// 随机私钥
function newRandomKey() {}

// 通过私钥创建钱包
function newWalletFromPrivateKey(privateKey) {
  
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
function sendTransaction(wallet,to,value) {}


export {
  checkPrivate,
  checkAddress,
  newRandomKey,
  newWalletFromPrivateKey,
  newWalletFromMmic,
  newRandomWallet,
  genMmic,
  newWalletFromJson,
  checkJsonWallet,
  connectWallet,
  sendTransaction,
}

