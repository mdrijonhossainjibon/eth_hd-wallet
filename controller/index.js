/**
 * It is library that helps creating addres, transfer amount
 * it supports ether
 */
const ethers = require('ethers');
let provider;

if (process.env.PROVIDER_ACTIVE === 'RPC')
  provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
else if (process.env.PROVIDER_ACTIVE === 'WEB3') {
  const Web3 = require('web3');
  const web3 = new Web3(process.env.WEB3_PROVIDER);
  provider = new ethers.providers.Web3Provider(web3.currentProvider);
} else provider = new ethers.getDefaultProvider(process.env.CHAIN);

provider.on('block', (blockNumber) => {
  console.log('BLOCK SYNCED = ', blockNumber);
});

const createWallet = async (req, res) => {
  try {
    let wallet = new ethers.Wallet.createRandom();
    res.sendResponse(
      {
        password: wallet.signingKey.keyPair.privateKey,
        address: wallet.signingKey.address,
      },
      200,
      'Address created successfully.'
    );
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

const transferAmount = async (req, res) => {
  try {
    let wallet = new ethers.Wallet(req.body.password, provider);
    let transaction = {
      to: req.body.to,
      value: ethers.utils.parseEther(req.body.amount),
    };
    let sendTransactionPromise = wallet.sendTransaction(transaction);
    return sendTransactionPromise.then((tx) => {
      res.sendResponse(tx, 200, 'Transfered successfully.');
    });
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

const getBalance = async (req, res) => {
  try {
    provider.getBalance(req.params.address).then((balance) => {
      let etherString = ethers.utils.formatEther(balance);
      res.sendResponse(etherString, 200, 'Get Balance - success.');
    });
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

module.exports = { createWallet, getBalance, transferAmount };
