# Ethereum-txn-status

> 

[![NPM](https://img.shields.io/npm/v/ethereum-txn-status.svg)](https://www.npmjs.com/package/ethereum-txn-status) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ethereum-txn-status
```

## Usage

```jsx
import React, { Component } from 'react'

import TransactionStatus from 'ethereum-txn-status'

class Example extends Component {
  render () {
    return (
      <TransactionStatus transaction_hash={tx_hash} dfuse_api_key={dfuse_key} network={"ropsten"}/>
    )
  }
}
```

![alt text](https://github.com/KashmereLabs/ethereum-txn-status/blob/master/screenshot/tx_pending.png "Pending Transaction")

## Props
```
transaction_hash (Required) : The hash of the transaction that you want to track.
```
If you want to track the hash of a recently made transaction, use the hash provided in the web3 sendTransaction callback.(See example for more details)

```
dfuse_api_key (Required):The API key to query the Ethereum blockchain with. 
```
A free API key can be obtained [here](https://app.dfuse.io/keys)

```
Network (Optional): mainnet or ropsten
```
The default is mainnet, 




## License

MIT © [pRoy24](https://github.com/pRoy24)
# ethereum-txn-status
