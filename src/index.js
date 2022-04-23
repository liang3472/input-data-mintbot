import { createAlchemyWeb3 } from '@alch/alchemy-web3';

// ******************** 注意修改这块 ********************
const CONTRACT = '填写合约地址';
// mint 价格(eth), 注意要根据自己mint的数量去计算
const PRICE = 0;
// 发起交易数
let step = 1;
// 填写钱包信息
const WALLET = {
  address: '填写你的钱包地址',
  pk: '填写你的钱包私钥'
};
// 填写相应的input data, 根据工具生成16进制，注意0x开头 e.g 0x1249c58b
const INPUT_DATA = '0x填写16进制编码';
const MAX_PRIORITY_FEE_PER_GAS = 200;
const MAX_FEE_PER_GAS = 200;
// 执行间隔 单位（毫秒数）, 这里是1000 也就是1秒mint一次
const DELAY_TIME = 1000;
// 去alchemy 申请的appkey
const ALCHEMY_AK = '填写你申请的alchemy AK';
// *****************************************************

// test测试网， main主网
const currENV = 'test';
const RPC_ENV = {
  main: 'wss://eth-mainnet.alchemyapi.io',
  test: 'wss://eth-rinkeby.ws.alchemyapi.io'
};

if(!ALCHEMY_AK) {
  console.log('请设置alchemy ak');
}
const web3 = createAlchemyWeb3(`${RPC_ENV[currENV]}/v2/${ALCHEMY_AK}`);

const estimateGas = (wallet, data, nonce) => {
  if (wallet.address && wallet.pk) {
    const address = wallet.address.toLocaleLowerCase();
    console.log(`♻️ ${address}正在同步当前gas...`);
    web3.eth.estimateGas({
      from: address,
      data: data,
      to: CONTRACT,
      value: web3.utils.toWei(String(PRICE), 'ether'),
    }).then(async (estimatedGas) => {
      const fields = {
        from: address,
        gas: estimatedGas,
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(String(MAX_PRIORITY_FEE_PER_GAS), 'gwei')),
        maxFeePerGas: web3.utils.toHex(web3.utils.toWei(String(MAX_FEE_PER_GAS), 'gwei')),
        to: CONTRACT,
        value: web3.utils.toWei(String(PRICE), 'ether'),
        data: web3.utils.toHex(data)
      };
      const signedTx = await signTx(wallet.pk, fields, nonce);
      sendTx(signedTx);
    }).catch(err => {
      console.log('操作异常:', err);
    });
  } else {
    console.log('请检查钱包配置')
    return;
  }
}

const signTx = async (pk, fields = {}, nonce) => {
  console.log('nonce:', nonce);
  const transaction = {
    nonce: nonce,
    ...fields,
  };
  console.log(`✍️ 签名中...`);
  return await web3.eth.accounts.signTransaction(transaction, pk);
}

const sendTx = async (signedTx) => {
  if (!signedTx?.rawTransaction) {
    console.log('❌ 交易异常!');
    return;
  }
  console.log(`📧 发送交易中...`);
  web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
    if (!error) {
      console.log(`✅ 交易发送成功 ${hash}`);
    } else {
      console.log('发生异常', error);
    }
  });
}

// 发起交易
const run = async () => {
  step -= 1;
  const wallet = WALLET;
  estimateGas(wallet, INPUT_DATA, currNonce);
  currNonce += 1;
  console.log('执行send-----');
  if (step <= 0) {
    console.log('定时任务执行完成');
  } else {
    setTimeout(() => run(), DELAY_TIME);
  }
}

let currNonce;
web3.eth.getTransactionCount(WALLET.address, 'latest').then(nonce => {
  currNonce = nonce;
  console.log('最后一次nonce:', nonce);
  run();
}).catch(err => {
  console.log('获取nonce异常');
});