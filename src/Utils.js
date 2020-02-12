const { createDfuseClient, waitFor } = require("@dfuse/client")

const client = createDfuseClient({
    apiKey: 'web_ba3560eac90ff4f5ad36f68d1926ec30',
    network: 'ropsten.eth.dfuse.io'
});

module.exports = {
    getTransactionStatusQuery(txId) {
        const txHashString = `hash: "${txId}"`;

        const txQuery = `subscription {
        transactionLifecycle(${txHashString}){
        previousState
        currentState
        transitionName
        transition {
            __typename

            ... on TrxTransitionInit {
                transaction {
                    ...TransactionFragment
                }
                blockHeader {
                    ...BlockHeaderFragment
                }
                trace {
                    ...TransactionTraceFragment
                }
                confirmations
                replacedById
            }

            ...on TrxTransitionPooled {
                transaction {
                    ...TransactionFragment
                }
            }

            ...on TrxTransitionMined {
                blockHeader {
                    ...BlockHeaderFragment
                }
                trace {
                    ...TransactionTraceFragment
                }
                
            }

            ...on TrxTransitionForked {
                transaction {
                    ...TransactionFragment
                }
            }

            ...on TrxTransitionConfirmed {
                confirmations
            }

            ...on TrxTransitionReplaced {
                replacedById
            }

            }
        }
    }
    
    fragment TransactionFragment on Transaction {
        hash
        from
        to
        nonce
        gasPrice
        gasLimit
      value(encoding:ETHER)
        inputData
        signature {
            v
            s
            r
        }
    }
    
    fragment TransactionTraceFragment on TransactionTrace {
        hash
        from
        to
        nonce
        gasPrice
        gasLimit
        value(encoding:ETHER)
        inputData
        signature {
            v
            s
            r
        }
        cumulativeGasUsed
        publicKey
        index
        create
        outcome
    }
    
    fragment BlockHeaderFragment on BlockHeader {
        parentHash
        unclesHash
        coinbase
        stateRoot
        transactionsRoot
        receiptRoot
        logsBloom
        difficulty
        number
        gasLimit
        gasUsed
        timestamp
        extraData
        mixHash
        nonce
        hash
    }`;
        return txQuery;
    }
}
