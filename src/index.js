import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'babel-polyfill';
import styles from './styles.css';
import { getTransactionStatusQuery } from './Utils';
import { createDfuseClient } from "@dfuse/client"

export default class TransactionStatus extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.getTransactionStatus = this.getTransactionStatus.bind(this);


    this.state = { walletAddress: '', transactionSteps: [], containerVisibleToggle: 'display: block' };
  }
  componentWillMount() {
    const { dfuseApiKey } = this.props;
    this.getTransactionStatus();
  }

  getTransactionStatus() {
    const { transaction_hash, dfuse_api_key, network } = this.props;

    let ETHQ_ENDPOINT = "https://ethq.app";
    let DFUSE_NETWORK = "mainnet.eth.dfuse.io";

    if (network === 'ropsten') {
      ETHQ_ENDPOINT = "https://ropsten.ethq.app";
      DFUSE_NETWORK = "ropsten.eth.dfuse.io";
    }

    const client = createDfuseClient({
      apiKey: dfuse_api_key,
      network: DFUSE_NETWORK
    });

    const self = this;

    async function subscribeUpdate(txId, self) {

      const txQuery = getTransactionStatusQuery(transaction_hash);
      const stream = await client.graphql(txQuery, (message) => {
        if (message.type === "data") {
          let currentTransactionSteps = self.state.transactionSteps;
          currentTransactionSteps.push(message.data.transactionLifecycle);
          self.setState({ transactionSteps: currentTransactionSteps });

          if (message.data.transactionLifecycle.transitionName === 'CONFIRMED') {
            let transitionConfirmations = message.data.transactionLifecycle.transition.confirmations;
            if (transitionConfirmations >= 16) {
              stream.close();
            }
          }
        }
      })
      await stream.join();
    }
    subscribeUpdate(transaction_hash, self);

  }

  render() {
    const { transactionSteps } = this.state;
    const { network, body_background, banner_background, text_color } = this.props;

    let ETHQ_ENDPOINT = "https://ethq.app";
    let DFUSE_NETWORK = "mainnet.eth.dfuse.io";

    if (network === 'ropsten') {
      ETHQ_ENDPOINT = "https://ropsten.ethq.app";
      DFUSE_NETWORK = "ropsten.eth.dfuse.io";
    }

    let styles = {
      outerContainer: {

        'marginTop': '10px',
        'marginBottom': '10px',

      },
      containerStyle: {
        'background': '#f5f5f5',
        'marginTop': '20px',
      },
      stepHeaderContainer: {
        'background': '#1438A6',
        'color': '#f5f5f5',
        'position': 'relative',
      },
      hideContainerCheck: {
        'position': 'absolute',
        'top': '-2px',
        'right': '4px',
        'fontSize': '20px',
        'fontWeight': '800',
      },
      stepperBodyContainer: {
        'padding': '10px 12px'
      },
      statusStep: {
        'width': '68%',
        'display': 'inline-block',
      },
      statusLine: {
        'width': '30%',
        'display': 'inline-block',
        'verticalAlign': 'top',
      },
      currentStatusStepper: {
        'width': '100%',
        'display': 'block',
        'position': 'relative',
        'marginTop': '10px'
      },
      cellContainer: {
        'display': 'inline-block',
        'width': '30%',
      },
      statusCellMeta: {
        'width': '100%',
        'position': 'relative',
        'display': 'block',
      },
      stepperLine: {
        'display': 'inline-block',
        'width': '80px',
        'background': '#d3d3d3',
        'borderRadius': '4px',
        'height': '6px',
        'marginBottom': '28px',
        'marginLeft': '-18px',
        'marginRight': '8px'
      },
      stepperCircle: {
        'width': '30px',
        'height': '30px',
        'borderRadius': '50%',
        'background': '#ffc107',
        'fontSize': '18px',
        'fontWeight': '600',
      },

      stepperSuccessCircle: {
        'width': '30px',
        'height': '30px',
        'borderRadius': '50%',
        'background': '#28a745',
        'fontSize': '18px',
        'fontWeight': '600',
      },
      stepperFailureCircle: {
        'width': '30px',
        'height': '30px',
        'borderRadius': '50%',
        'background': '#dc3545',
        'fontSize': '18px',
        'fontWeight': '600',
      },

      progressBarContainer: {
        'position': 'relative',
        'paddingBottom': '20px',
        'display': 'block',
      },
      stepperCircleContainer: {
        'display': 'inline-block',
        'textAlign': 'center'
      },
      cellLabel: {
        'fontWeight': '600',
        'fontSize': '11px',
      },
      cellData: {
        'fontWeight': '500',
        'fontSize': '16px',
      },
      stepHeaderLabel: {
        'padding': '6px 10px',
      },
      stepLabel: {
        'marginLeft': '-12px',
        'marginTop': '6px'
      },
    }

    if (body_background) {
      styles.containerStyle.background = body_background;
    }
    if (banner_background) {
      styles.stepHeaderContainer.background = banner_background;
    }
    if (text_color) {
      styles.outerContainer.color = text_color;
    }


    let transactionFromAddress = "";
    let transactionToAddress = "";
    let transactionEtherValue = <span/>;
    let currentStep = <span/>;
    let transactionFromDisplay = <span/>;
    let transactionToDisplay = <span/>;

    if (transactionSteps.length > 0) {
      let lastTransition = transactionSteps[transactionSteps.length - 1];
      let numConfirmations = "";
      let numConfirmationBlock = <span/>;


      if (lastTransition.transitionName === 'CONFIRMED') {
        numConfirmations = lastTransition.transition.confirmations;
        numConfirmationBlock = <div>{numConfirmations} Confirmations</div>
      }
      currentStep =
        (<div>
        {lastTransition.transitionName}
        {numConfirmationBlock}
      </div>)
      let firstStep = null;
      transactionSteps.forEach(function(ts) {
        if (ts.transition && ts.transition.transaction) {
          firstStep = ts;
        }
      });
      if (firstStep) {
        transactionFromAddress = firstStep.transition.transaction.from;
        transactionToAddress = firstStep.transition.transaction.to;
        transactionEtherValue = firstStep.transition.transaction.value;

        transactionFromDisplay = transactionFromAddress.substr(0, 5) + "...." + transactionFromAddress.substr(transactionFromAddress.length - 6, transactionFromAddress.length - 1);
        transactionFromDisplay = <a href={`${ETHQ_ENDPOINT}/search?q=(from:${transactionFromAddress}%20OR%20to:${transactionFromAddress})`} target="_blank">{transactionFromDisplay}</a>;

        transactionToDisplay = transactionToAddress.substr(0, 5) + "...." + transactionToAddress.substr(transactionToAddress.length - 6, transactionToAddress.length - 1);
        transactionToDisplay = <a href={`${ETHQ_ENDPOINT}/search?q=(from:${transactionToAddress}%20OR%20to:${transactionToAddress})`} target="_blank">{transactionToDisplay}</a>;

      }
    }

    let steps = [];
    transactionSteps.forEach(function(item, idx) {
      if (idx === 0) {
        let currentStepList = [{ 'label': item.previousState }]

        if (item.currentState !== item.previousState) {
          currentStepList.push({ 'label': item.currentState })
        }
        steps = steps.concat(currentStepList);
      }
      else {
        let currentStepList = [];
        if (item.previousState !== transactionSteps[idx - 1].currentState) {
          currentStepList.push({ 'label': item.previousState })
        }
        if (item.currentState !== item.previousState) {
          currentStepList.push({ 'label': item.currentState })
        }
        steps = steps.concat(currentStepList);
      }
    });

    let pendingTransactionSteps = (


      <div className="progress-bar-container">
        {steps.map(function(item, idx){
        let stepperStep = idx + 1;
        let joiner = <span/>;
        if (idx < steps.length - 1) {
          joiner =  <div className="stepper-line" style={styles.stepperLine}></div>
        }
        let itemLabel = (item.label[0] + item.label.substr(1, item.label.length - 1).toLowerCase()).replace("_", " ");
        let circleStyle = styles.stepperCircle;
        if (item.label === 'IN_BLOCK') {
          circleStyle = styles.stepperSuccessCircle;
        }
        if (item.label === 'FAILED') {
          circleStyle = styles.stepperFailureCircle;
        }
        return (
          <span key={`tx-step-${idx}`}>
              <div className="stepper-circle-container" key={"tx-confirmation-"+idx} style={styles.stepperCircleContainer}>
                <div className="stepper-circle stepper-left" style={circleStyle}>
                  {stepperStep}
                </div>
                <span style={styles.stepLabel}>{itemLabel}</span>
              </div>
              {joiner}
          </span>
        )
        })}
        </div>
    )
    return (
      <div style={styles.outerContainer}>
      
      <div>
      <div style={styles.containerStyle}>
          
          <div style={styles.stepHeaderContainer}>
            <div style={styles.stepHeaderLabel}>
              New transaction created.
            </div>
            <div onClick={this.hideOuterContainer} style={styles.hideContainerCheck}>&#xd7;</div>
          </div>
          <div style={styles.stepperBodyContainer}>
          <div className="status-cell-meta" style={styles.statusCellMeta}>
            <div className="cell-container" style={styles.cellContainer}>
              <div className="cell-data" style={styles.cellData}>
                {transactionFromDisplay}
              </div>
              <div className="cell-label" style={styles.cellLabel}>
                From
              </div>
            </div>
            <div className="cell-container" style={styles.cellContainer}>
              <div className="cell-data" style={styles.cellData}>
                {transactionToDisplay}
              </div>
              <div className="cell-label" style={styles.cellLabel}>
                To
              </div>
            </div>
            <div className="cell-container" style={styles.cellContainer}>
              <div className="cell-data" style={styles.cellData}>
                {transactionEtherValue} Ether
              </div>
              <div className="cell-label" style={styles.cellLabel}>
                Value
              </div>
            </div>
            
          </div>
          <div className="current-status-stepper" style={styles.currentStatusStepper}>
            <div className="status-line" style={styles.statusLine}>
              {currentStep}
            </div>
            <div className="" style={styles.statusStep}>
              { pendingTransactionSteps } 
            </div>
          </div>
      </div>
      </div> 
      </div>
      </div>
    )
  }
}
