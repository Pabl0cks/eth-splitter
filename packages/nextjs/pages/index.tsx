import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { erc20ABI } from "wagmi";
import { useBalance, useContractRead, useContractWrite, useProvider } from "wagmi";
import {
  ArrowUpOnSquareIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useAccountBalance } from "~~/hooks/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const tokenTypes = [
  {
    value: "ETH",
    label: "ETH",
  },
  {
    value: "ERC-20",
    label: "ERC-20",
  },
];

const FreeMultiSender = () => {
  const [tokenType, setTokenType] = useState("ETH");
  const [csvText, setCsvText] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  const [balancesToSend, setbalancesToSend] = useState<BigNumber[]>([]);
  const [totalEtherOrTokens, settotalEtherOrTokens] = useState(0);
  const [shouldSend, setShouldSend] = useState(false);
  const { address } = useAccount();
  const provider = useProvider();
  const [showSummary, setShowSummary] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const { balance } = useAccountBalance(address);
  const [invalidAddresses, setInvalidAddresses] = useState<string[]>([]);
  const [invalidTotalEth, setInvalidTotalEth] = useState(0);
  const [step, setStep] = useState("Prepare");
  const [showSampleModal, setShowSampleModal] = useState(false);
  const sampleCsvContent = `0xB63dE4b100aA44F054cBe7Be71055E81Ab7f264B,0.0056
0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,0.0045
0x7D52422D3A5fE9bC92D3aE8167097eE09F1b347d,0.049
0x64c9525A3c3a65Ea88b06f184F074C2499578A7E,0.041
pabl0cks.eth,0.01`;
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [erc20Address, setErc20Address] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTokenType(event.target.value);
  };

  async function resolveENS(name: string) {
    // Create a separate provider for mainnet
    const mainnetProvider = new ethers.providers.InfuraProvider("homestead", process.env.INFURA_API_KEY);

    try {
      const address = await mainnetProvider.resolveName(name);
      if (!address) {
        throw new Error("ENS name not found.");
      }
      return address;
    } catch (error) {
      console.error(`Error resolving ENS name: ${error}`);
      return null;
    }
  }

  const handleExampleClick = () => {
    setShowSampleModal(true);
  };

  const handleModalCloseClick = () => {
    setShowSampleModal(false);
  };

  const handleCopySampleClick = () => {
    navigator.clipboard.writeText(sampleCsvContent);
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const target = e.target;
        if (target) {
          const result = target.result;
          if (result) {
            setCsvText(result as string);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmClick = () => {
    setShouldSend(true);
  };

  const Step = ({ title, isActive }: { title: string; isActive: boolean }) => (
    <div
      className={`${
        isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
      } w-1/3 px-4 py-2 text-center font-semibold rounded`}
    >
      {title}
    </div>
  );

  const multisendTokenTx = useScaffoldContractWrite({
    contractName: "FreeMultiSender",
    functionName: "multisendToken",
    args: [erc20Address, contributors, balancesToSend],
  });

  const { data: tokenBalanceData } = useBalance({
    address: address,
    token: erc20Address,
    chainId: provider.network.chainId,
    watch: true,
  });

  const tokenBalance = tokenBalanceData?.formatted ?? "Loading...";

  const { data: tokenSymbol } = useContractRead({
    chainId: provider.network.chainId, // replace with your chainId
    address: erc20Address,
    abi: erc20ABI,
    functionName: "symbol",
  });

  const { data: tokenDecimalsData } = useContractRead({
    abi: erc20ABI,
    address: erc20Address,
    functionName: "decimals",
  });

  let tokenDecimals = tokenDecimalsData;

  // If tokenDecimals is undefined, set it to 18
  if (tokenDecimals === undefined) {
    tokenDecimals = 18;
  }

  const { data: allowance } = useContractRead({
    address: erc20Address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [
      (address || "0x0").toString(),
      /*Your contract address -> localhost is 0x10962E2eD5D882982EcD4789636f14ABC9eFc066*/
      "0x10962E2eD5D882982EcD4789636f14ABC9eFc066",
    ],
  });

  const needApproval =
    tokenType !== "ETH" &&
    allowance &&
    allowance.lt(ethers.utils.parseUnits(totalEtherOrTokens.toString(), tokenDecimals));

  const approvalTx = useContractWrite({
    mode: "recklesslyUnprepared",
    address: erc20Address,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      /*Your contract address -> localhost is 0x10962E2eD5D882982EcD4789636f14ABC9eFc066*/
      "0x10962E2eD5D882982EcD4789636f14ABC9eFc066",
      /*Quantity to approve*/
      ethers.utils.parseUnits(totalEtherOrTokens.toString(), tokenDecimals),
    ],
  });

  const handleApprovalClick = async () => {
    if (approvalTx && approvalTx.writeAsync) {
      const response = await approvalTx.writeAsync();
      const receipt = await response.wait(); // wait for transaction confirmation
      console.log(receipt);
      if (receipt.status === 1) {
        // check transaction status
        setIsApproved(true);
      } else {
        console.error("Transaction failed.");
      }
    }
  };

  const multisendEtherTx = useScaffoldContractWrite({
    contractName: "FreeMultiSender",
    functionName: "multisendEther",
    args: [contributors, balancesToSend],
    value: totalEtherOrTokens.toString(),
  });

  const handleSendClick = async () => {
    setContributors([]);
    setbalancesToSend([]);
    settotalEtherOrTokens(0);
    setInvalidAddresses([]);
    setInvalidTotalEth(0);

    const lines = csvText.split("\n").filter(line => line.trim() !== "");

    for (const line of lines) {
      const [addressOrENS, balanceToSend] = line.split(",").map(item => item.trim());

      if (addressOrENS && balanceToSend) {
        const resolvedAddress = await resolveENS(addressOrENS);
        if (resolvedAddress) {
          console.log("currenttotalEtherOrTokens: " + totalEtherOrTokens.toString());
          console.log("balanceToSend: " + parseFloat(balanceToSend).toString());
          setContributors(currentContributors => [...currentContributors, resolvedAddress]);
          setbalancesToSend(currentbalancesToSend => [
            ...currentbalancesToSend,
            balance
              ? ethers.utils.parseUnits(balanceToSend, tokenDecimals)
              : ethers.utils.parseUnits("0", tokenDecimals),
          ]);
          settotalEtherOrTokens(currenttotalEtherOrTokens => {
            const newTotal = ethers.utils
              .parseUnits(currenttotalEtherOrTokens.toString(), tokenDecimals)
              .add(ethers.utils.parseUnits(balanceToSend.toString(), tokenDecimals));
            const newTotalFloat = parseFloat(ethers.utils.formatUnits(newTotal, tokenDecimals));
            return newTotalFloat;
          });
        } else {
          setInvalidAddresses(currentInvalidAddresses => [...currentInvalidAddresses, addressOrENS]);
          setInvalidTotalEth(currentInvalidTotalEth => (currentInvalidTotalEth += parseFloat(balanceToSend)));
        }
      }
    }

    console.log("Total Ether or Tokens:", totalEtherOrTokens);
    console.log("Contributors:", contributors);
    console.log("balancesToSend:", balancesToSend);

    setShowSummary(true);
    setStep("Confirm");
  };

  const SummaryScreen = () => {
    return (
      <div className="bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 rounded p-4">
            <h3>Total {tokenType === "ETH" ? tokenType : tokenSymbol} to send:</h3>
            <p>{totalEtherOrTokens}</p>
          </div>
          <div className="bg-gray-100 rounded p-4">
            <h3>Your {tokenType === "ETH" ? tokenType : tokenSymbol} balance:</h3>
            <p>{tokenType === "ETH" ? balance : tokenBalance}</p>
          </div>
          <div className="bg-gray-100 rounded p-4">
            <h3>Total valid addresses:</h3>
            <p>{contributors.length}</p>
          </div>
        </div>
        <h3 className="font-semibold mb-2">Recipients:</h3>
        <table className="table-auto mb-4 w-full">
          <tbody>
            {contributors.map((address, index) => (
              <tr key={index}>
                <td className="py-2 pr-2">
                  <Address address={address} format="long" />
                </td>
                <td>
                  {ethers.utils.formatEther(balancesToSend[index])} {tokenType === "ETH" ? tokenType : tokenSymbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invalidAddresses.length > 0 && (
          <>
            <h3 className="font-semibold mb-2">Invalid Addresses:</h3>
            <table className="table-auto mb-4">
              <tbody>
                {invalidAddresses.map((address, index) => (
                  <tr key={index} className={index < invalidAddresses.length - 1 ? "border-b border-gray-200" : ""}>
                    <td className="py-2 pr-4">{address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-100 rounded p-4">
                <h3>Total ETH not sent due to invalid addresses:</h3>
                <p>{invalidTotalEth}</p>
              </div>
              <div className="bg-gray-100 rounded p-4">
                <h3>Total number of invalid addresses:</h3>
                <p>{invalidAddresses.length}</p>
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => {
            setShowSummary(false);
            setStep("Prepare");
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Go back
        </button>

        {!isApproved && tokenType !== "ETH" && (
          <button
            onClick={handleApprovalClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Approve use of {tokenSymbol}
          </button>
        )}
        <button
          onClick={handleConfirmClick}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
            !isApproved && tokenType !== "ETH" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isApproved && tokenType !== "ETH"}
        >
          Confirm
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (shouldSend) {
      const sendTransaction = async () => {
        let tx;
        try {
          console.log("tokenType: " + tokenType);
          if (tokenType === "ETH") {
            tx = await multisendEtherTx.writeAsync();
          } else {
            console.log("erc20Address: " + erc20Address);
            console.log("totalEtherOrTokens: " + totalEtherOrTokens.toString());
            tx = await multisendTokenTx.writeAsync();
          }
        } catch (error) {
          console.error("Error sending transaction:", error);
          return;
        }

        if (tx) {
          setTransactionHash(tx.hash);
          setShowSummary(false);
          setShowTransaction(true);
          setStep("Sent");
        } else {
          console.error("Transaction not created.");
        }
      };

      sendTransaction();
      setShouldSend(false);
    }
  }, [
    shouldSend,
    tokenType,
    multisendEtherTx,
    multisendTokenTx,
    approvalTx,
    erc20Address,
    totalEtherOrTokens,
    allowance,
    needApproval,
  ]);

  return (
    <div style={{ maxWidth: "53em" }} className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-4">ETH Splitter</h1>
      <div className="flex mb-6">
        <Step title="Prepare" isActive={step === "Prepare"} />
        <Step title="Confirm" isActive={step === "Confirm"} />
        <Step title="Sent" isActive={step === "Sent"} />
      </div>
      {showSampleModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleModalCloseClick}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">CSV Sample</h3>
                  <button
                    type="button"
                    className="ml-3 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleModalCloseClick}
                  >
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-2">
                  <pre className="bg-gray-200 p-4 rounded overflow-x-auto">{sampleCsvContent}</pre>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="ml-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCopySampleClick}
                >
                  <ClipboardDocumentListIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  Copy to clipboard
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={handleModalCloseClick}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSummary ? (
        <SummaryScreen />
      ) : showTransaction ? (
        step === "Sent" &&
        transactionHash && (
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Transaction Sent</h2>
            <p>
              The transaction has been sent and is waiting to be mined. You can review the transaction details on
              Etherscan:
            </p>
            <p>
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View on Etherscan
              </a>
            </p>
            <button
              onClick={() => {
                setShowSummary(false);
                setStep("Prepare");
                setShowTransaction(false);
                setIsApproved(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-8 rounded"
            >
              Create new split
            </button>
          </div>
        )
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="token-type" className="block mb-2 font-bold">
              Token Type
            </label>
            <select
              id="token-type"
              value={tokenType}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {tokenTypes.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {tokenType === "ERC-20" && (
              <div className="mb-4 mt-4">
                <label htmlFor="erc20-address" className="block mb-2 font-bold">
                  Token Address
                </label>
                <input
                  id="erc20-address"
                  value={erc20Address}
                  onChange={e => setErc20Address(e.target.value)}
                  type="text"
                  className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter ERC-20 token address"
                />
              </div>
            )}
          </div>

          <div className="relative mb-4">
            <label htmlFor="csv-data" className="block mb-2 font-bold">
              CSV Data
            </label>
            <textarea
              id="csv-data"
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              className="block w-full border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 cursor-text focus:outline-none"
              rows={10}
            />
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <button onClick={handleExampleClick} className="text-gray-500 hover:text-gray-700">
                <DocumentTextIcon className="w-6 h-6 inline-block mr-1" />
                <span>See CSV sample</span>
              </button>
            </div>
            <div className="absolute bottom-0 right-0 mb-2 mr-2">
              <input accept=".csv" style={{ display: "none" }} id="csv-upload" type="file" onChange={handleCsvUpload} />
              <label htmlFor="csv-upload" className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <ArrowUpOnSquareIcon className="w-6 h-6 inline-block mr-1" />
                <span>Upload CSV</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleSendClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </>
      )}
    </div>
  );
};

export default FreeMultiSender;
