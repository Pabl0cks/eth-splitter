const contracts = {
  31337: [
    {
      name: "localhost",
      chainId: "31337",
      contracts: {
        FreeMultiSender: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "total",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "tokenAddress",
                  type: "address",
                },
              ],
              name: "Multisended",
              type: "event",
            },
            {
              inputs: [],
              name: "arrayLimit",
              outputs: [
                {
                  internalType: "uint16",
                  name: "",
                  type: "uint16",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "_newLimit",
                  type: "uint16",
                },
              ],
              name: "changeTreshold",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address[]",
                  name: "_contributors",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "_balances",
                  type: "uint256[]",
                },
              ],
              name: "multisendEther",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "token",
                  type: "address",
                },
                {
                  internalType: "address[]",
                  name: "_contributors",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "_balances",
                  type: "uint256[]",
                },
              ],
              name: "multisendToken",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "txCount",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
  11155111: [
    {
      name: "sepolia",
      chainId: "11155111",
      contracts: {
        FreeMultiSender: {
          address: "0x10962E2eD5D882982EcD4789636f14ABC9eFc066",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "total",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "tokenAddress",
                  type: "address",
                },
              ],
              name: "Multisended",
              type: "event",
            },
            {
              inputs: [],
              name: "arrayLimit",
              outputs: [
                {
                  internalType: "uint16",
                  name: "",
                  type: "uint16",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint16",
                  name: "_newLimit",
                  type: "uint16",
                },
              ],
              name: "changeTreshold",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address[]",
                  name: "_contributors",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "_balances",
                  type: "uint256[]",
                },
              ],
              name: "multisendEther",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "token",
                  type: "address",
                },
                {
                  internalType: "address[]",
                  name: "_contributors",
                  type: "address[]",
                },
                {
                  internalType: "uint256[]",
                  name: "_balances",
                  type: "uint256[]",
                },
              ],
              name: "multisendToken",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "txCount",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
