import React, { Component } from 'react'
import Web3 from 'web3';
import TransactionStatus from 'ethereum-txn-status'

const DFUSE_API_KEY = process.env.REACT_APP_DFUSE_API_KEY;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { currentView: '', pendingTransactions: [] };

  }
  componentWillMount() {
    const web3 = window.web3;
    const self = this;

    if (!web3) {
      this.setState({ 'currentView': 'login' });
    }
    else {

      this.setState({ 'currentView': 'home' });
    }

    window.addEventListener('load', async() => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();

        }
        catch (error) {
          this.setState({ 'currentView': 'login' });
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
      }

      // Non-dapp browsers...
      else {
        this.setState({ 'currentView': 'login' });

      }
    });

    if (web3 && web3.utils) {
      let walletAddress = window.ethereum.selectedAddress;
      web3.eth.getBalance(walletAddress, function(error, result) {

        if (error) {
          // Do nothing
        }
        else {

        }
      })
    }
  }

  createPayment = () => {
    const web3 = window.web3;
    const senderAddress = window.ethereum.selectedAddress;
    const recipientAddress = "0x9e8Ea20B629706658548A9Be78F852843E560c90";
    const amount = "0.01";
    const amountString = web3.utils.toWei(amount.toString());
    const self = this;

    const params = {
      from: senderAddress,
      to: recipientAddress,
      value: amountString,
    };
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(params, function(err, response) {
        if (err) {
          reject(err);
        }
        let pendingTransactionList = self.state.pendingTransactions;
        pendingTransactionList.push(response);
        self.setState({ pendingTransactions: pendingTransactionList });

        resolve(response);
      })
    });
  }

  render() {
    const { pendingTransactions } = this.state;

    let pendingTransactionStatus = <span/>;
    const styles = {
      'containerStyle': {
        'background': '#fff'
      }
    }
    if (pendingTransactions.length > 0) {

      pendingTransactionStatus =
        pendingTransactions.map(function(tx_hash, idx) {
          return (
            <TransactionStatus transaction_hash={tx_hash} key={tx_hash+"-"+idx}
      dfuse_api_key={DFUSE_API_KEY} network={"ropsten"} custom_styles={styles}/>
          )
        })
    }

    return (
      <div styles={{'width': '80%', 'marginLeft': '10%'}}>
        {pendingTransactionStatus}
        <div>
          <div style={{'marginTop':'20px','marginBottom': '20px'}}>
          <button onClick={this.createPayment} style={{'width':'120px', 'height': '40px'}}>Donate to kitty</button>
            &nbsp;Help buy litterbox and cat food for kitty.
          </div>
          <img src="https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg" style={{"width": "100%"}}/>
        </div>
      </div>
    )
  }
}
