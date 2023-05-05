import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { ArrowUpOnSquareIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

//const contributors = [];
//const balances = [];
//let totalEtherOrTokens = 0;

const tokenAddress = "";

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
  const [balances, setBalances] = useState<BigNumber[]>([]);
  const [totalEtherOrTokens, settotalEtherOrTokens] = useState(0);
  const [shouldSend, setShouldSend] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTokenType(event.target.value);
  };

  const handleExampleClick = () => {
    setCsvText(`0xB63dE4b100aA44F054cBe7Be71055E81Ab7f264B,0.000056
0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,0.45
0x7D52422D3A5fE9bC92D3aE8167097eE09F1b347d,0.049
0x64c9525A3c3a65Ea88b06f184F074C2499578A7E,1`);
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

  const multisendTokenTx = useScaffoldContractWrite({
    contractName: "FreeMultiSender",
    functionName: "multisendToken",
    args: [tokenAddress, contributors, balances],
  });

  const multisendEtherTx = useScaffoldContractWrite({
    contractName: "FreeMultiSender",
    functionName: "multisendEther",
    args: [contributors, balances],
    value: totalEtherOrTokens.toString(),
  });

  const handleSendClick = () => {
    //const contributors = [];
    setContributors([]);
    setBalances([]);
    settotalEtherOrTokens(0);

    //const balances = [];
    const lines = csvText.split("\n").filter(line => line.trim() !== "");
    //totalEtherOrTokens = 0;

    lines.forEach(line => {
      const [address, balance] = line.split(",").map(item => item.trim());

      if (address && balance) {
        //contributors.push(address);
        setContributors(currentContributors => [...currentContributors, address]);
        //balances.push(balance);
        setBalances(currentBalances => [
          ...currentBalances,
          balance ? ethers.utils.parseEther(balance) : ethers.utils.parseEther("0"),
        ]);
        //totalEtherOrTokens += parseFloat(balance);
        settotalEtherOrTokens(currenttotalEtherOrTokens => (currenttotalEtherOrTokens += parseFloat(balance)));
      }
    });

    console.log("Total Ether or Tokens:", totalEtherOrTokens);
    console.log("Contributors:", contributors);
    console.log("Balances:", balances);

    setShouldSend(true);

    // TODO: Connect your application with a Web3 library and interact with the smart contract functions.
    // You can use the `contributors` and `balances` arrays to call multisendEther or multisendToken functions.
  };

  useEffect(() => {
    if (shouldSend) {
      if (tokenType === "ETH") {
        multisendEtherTx.writeAsync();
        setShouldSend(false);
      } else {
        multisendTokenTx.writeAsync();
        setShouldSend(false);
      }
    }
  }, [shouldSend, tokenType, multisendEtherTx, multisendTokenTx]);

  // ... return statement

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-4">Multi-Sender</h1>
      <div className="mb-4">
        <label htmlFor="token-type" className="block mb-2">
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
      </div>
      <div className="flex justify-end items-center mb-4">
        <button onClick={handleExampleClick} className="mr-2 p-2 text-gray-500 hover:text-gray-700">
          <ArrowUpOnSquareIcon className="w-6 h-6" />
        </button>
        <input accept=".csv" style={{ display: "none" }} id="csv-upload" type="file" onChange={handleCsvUpload} />
        <label htmlFor="csv-upload" className="p-2 text-gray-500 hover:text-gray-700">
          <DocumentTextIcon className="w-6 h-6" />
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="csv-data" className="block mb-2">
          CSV Data
        </label>
        <textarea
          id="csv-data"
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          className="block w-full border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          rows={10}
        />
      </div>
      <button
        onClick={handleSendClick}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default FreeMultiSender;
