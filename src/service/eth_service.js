import {BlockTag, Provider, TransactionRequest, TransactionResponse} from "ethers/providers";
import {Arrayish, BigNumber, ProgressCallback} from "ethers/utils";

let ethers = require('ethers')
// import ethers from 'ethers'

// 默认路径
const PATH_PREFIX = "m/44'/60'/0'/0/"

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
        let realAddress =ethers.utils.getAddress(address)
        return realAddress
    }catch (e) {
        return ""
    }

}

// 随机私钥
function newRandomKey() {
    let randomByte = ethers.utils.randomBytes(32)
    let randomNumber = ethers.utils.bigNumberify(randomByte);
    return randomNumber.toHexString()
}

// 通过私钥创建钱包
function newWalletFromPrivateKey(privateKey) {
    let wallets = []
    let wallet = new ethers.Wallet(privateKey)
    wallets.push(wallet)
    return wallets
}

// 通过助记词创建钱包
function newWalletFromMmic(mmic, path) {
    let wallets = []
    for (let i = 0; i < 10; i++) {
        path = PATH_PREFIX + i
        let wallet = ethers.Wallet.fromMnemonic(mmic, path)
        wallets.push(wallet)
    }
    return wallets
}

// 随机创建钱包
function newRandomWallet() {
    let wallets = []
    let wallet = ethers.Wallet.createRandom()
    wallets.push(wallet)
    return wallets
}

// 校验地址
function checkJsonWallet(data) {
    return ethers.utils.getJsonWalletAddress(data)
}

// 从keystore导入钱包，需要密码
function newWalletFromJson(json, pwd) {

    return new Promise(async (resolve, reject) => {
        try {
            let wallets = []
            let wallet = await ethers.Wallet.fromEncryptedJson(json, pwd, false)
            wallets.push(wallet)
            resolve(wallets)
        } catch (e) {
            reject(e)
        }
    })
}

// 生成助记词
function genMmic() {
    let words = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
    return words
}

// 连接provider
function connectWallet(wallet, providerurl) {
    let provider = new ethers.providers.JsonRpcProvider(providerurl);
    return wallet.connect(provider);
}

// 发送交易
function sendTransaction(wallet,to,value) {
    return wallet.sendTransaction({
        to: to,
        value: value,
    })
}

// 获取历史交易
function getHistoryTransaction(address) {
    return new Promise(async (resolve, reject) => {
        try {
            let columnData = []
            // 测试网用ropsten的etherscan,正式环境不用带
            let provider = new ethers.providers.EtherscanProvider('ropsten')
            let history = await provider.getHistory(address)
            for (var i = 0; i < history.length; i++) {
                let key = i
                let hash = interceptAndReplace(history[i].blockHash, 1, 4)
                let sendFrom = interceptAndReplace(history[i].from, 4, 5)
                let sendTo = interceptAndReplace(history[i].to, 4, 5)
                let blockNumber = history[i].blockNumber
                let timestamp = getDateDiff(history[i].timestamp)
                let tbalance = ethers.utils.formatEther(history[i].value.toString()) + ' Eth'
                // 这里涉及到Gwei和eth的转换
                let gasPrice = ethers.utils.formatEther(history[i].gasPrice.mul(21000)) + ' Eth'
                let data = {
                    key: key,
                    hash: hash,
                    sendFrom: sendFrom,
                    sendTo: sendTo,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    balance: tbalance,
                    gasPrice: gasPrice,
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

function getDateDiff(data) {
    //var str = data;
    //将字符串转换成时间格式
    var timePublish = new Date(data * 1000);
    var timeNow = new Date();
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var diffValue = timeNow - timePublish;
    var diffMonth = diffValue / month;
    var diffWeek = diffValue / (7 * day);
    var diffDay = diffValue / day;
    var diffHour = diffValue / hour;
    var diffMinute = diffValue / minute;
    var result
    if (diffValue < 0) {
        alert("错误时间");
    }
    else if (diffMonth > 3) {
        result = timePublish.getFullYear() + "-";
        result += timePublish.getMonth() + "-";
        result += timePublish.getDate();
        alert(result);
    }
    else if (diffMonth > 1) {
        result = parseInt(diffMonth) + "月前";
    }
    else if (diffWeek > 1) {
        result = parseInt(diffWeek) + "周前";
    }
    else if (diffDay > 1) {
        result = parseInt(diffDay) + "天前";
    }
    else if (diffHour > 1) {
        result = parseInt(diffHour) + "小时前";
    }
    else if (diffMinute > 1) {
        result = parseInt(diffMinute) + "分钟前";
    }
    else {
        result = "刚收藏";
    }
    return result;
}
  

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
    getHistoryTransaction
}