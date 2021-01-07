### 一个简易的以太坊HD钱包

> 此项目是一个简易的Ethereum钱包代码，仅供学习参考使用

#### 技术栈

* Reactjs
* ant design
* ganache-cli
* ethersjs
* bip39

#### 安装启动

前端项目:

```shell
$ cs 项目地址
$ yarn install
```

ganache-cli:

```shell
$ ganache-cli -m '助记词(一般是12个单词)'

// 或使用 ganache-cli --help 查看帮助文档

// 也可以指定账户私钥和账户余额来创建初始测试账户
$ ganache-cli --account="<privatekey>,balance" [--account="<privatekey>,balance"]
```

启动项目:

```shell
$ yarn start
```

打开浏览器 [地址](http://127.0.0.1:3000), 端口自行配置

#### 关于

1. ganache-cli是以太坊测试软件的命令行版本，用于以太坊Dapp的开发与测试

2. 关于助记词，私钥和keystore

   <img src="https://raw.githubusercontent.com/w1ndyz/windy-img/master/img/mnemonic.png" alt="mnemonic" style="zoom:50%;" />

3. 钱包的核心

   打开钱包主要有一下几种方式:

* 私钥(privatekey)
* keystore+密码(keystore+password)
* 助记词(mnemonic code)

4. 什么是HD钱包？

   HD钱包全称是分层确定性钱包(Hierarchical Deterministic)。他用随机数生成私钥，再用一个确定的、不可逆的算法，给予主私钥生成任意数量的子私钥。

