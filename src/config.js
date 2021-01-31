
let eth_address, tron_address
if (process.env.REACT_APP_ENV == 'development') {
  console.log("这是本地环境")
  eth_address = 'http://127.0.0.1:8545'
  tron_address = 'https://api.shasta.trongrid.io'
  // tron_address = 'http://127.0.0.1:9090'
} else if (process.env.REACT_APP_ENV == 'test') {
  console.log("这是测试环境")
  eth_address = 'https://ropsten.infura.io/v3/2adf26fc0dc64d2481e3dc8e4eea6df5'
  tron_address = 'https://api.shasta.trongrid.io'
} else if (process.env.REACT_APP_ENV == 'production') {
  console.log("这是生产环境")
}

export { eth_address, tron_address }