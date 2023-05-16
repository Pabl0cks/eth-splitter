# ETH/ERC-20 MassSplitter

<kbd>![eth-mass-splitter]([https://user-images.githubusercontent.com/55535804/230684185-dfb2fcaa-fd13-4819-9311-7894bc27a27a.png](https://github.com/Pabl0cks/eth-splitter/assets/55535804/d04b65e5-cb8b-40cf-92ce-7a12398c3d58)</kbd>

MassSplitter is a ETH/ERC-20 Token splitter that allows users to split their ETH or ERC-20 Tokens to a large amount of recipients in a single transaction. (Up to 150 per transaction).
The difference with other multisenders is that MassSplitter is free to use, while others charge a fee per split.
Users can upload a csv files with the format `ethaddress , amount` or write the list of recipients and tokens to send to each one into the text field.

## Demo Video

You can watch a demo video of MassSplitter in action:
https://loom.com/share/b0a10b87c9064e2a93b96cfd5e8c5f20

## Features

- **Mass Distribution**: Users can distribute their tokens to up to 150 recipients in a single transaction, making it an efficient way to conduct mass payouts or token distributions.
- **Supports ETH and ERC-20 Tokens**: Users can choose to distribute either Ether (ETH) or any ERC-20 token of their choice.
- **Recipient Verification**: Implement a feature that verifies the validity of Ethereum addresses before attempting the transaction, reducing the chances of failed transactions.
- **CSV Upload Support**: Users can easily upload a CSV file with the format ethaddress, amount to quickly and accurately specify the recipients and amounts.
- **Manual Input Option**: For smaller distributions, users can manually input the list of recipients and corresponding amounts into a text field.
- **Transaction Confirmation**: Users receive a transaction hash for every distribution, allowing them to track and confirm the transaction on the Ethereum network.
- **Free to Use**: Unlike other multisender platforms that charge a fee per split, MassSplitter allows users to distribute their ETH or ERC-20 tokens to multiple recipients at no cost.

## Potential Future Developments

Some potential future developments for MassSplitter could include:

- **Batch Processing**: Increase the number of recipients per transaction, possibly by implementing more efficient data structures or adopting Layer 2 solutions.
- **Support for Additional Token Standards**: Expand the functionality to support other Ethereum token standards, such as ERC-721 (NFTs) or ERC-1155.
- **Scheduled Distributions**: Allow users to schedule token distributions for a future date and time.
- **Recipient Notification**: Implement a system that notifies recipients of incoming token distributions.
- **Implement Gas Optimizations**: Optimize gas usage and provide users a gas estimation.
- **Save lists of recipients**: Save lists with your frequently used recipients to reuse them in the future.

## Quickstart

To get started with Scaffold-Eth 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/Pabl0cks/eth-splitter.git
cd eth-splitter
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the contract component or the example ui in the frontend. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`
