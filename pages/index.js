import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [investmentBalance, setInvestmentBalance] = useState(undefined);
  const [owner, setOwner] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toString());
    }
  };

  const getInvestmentBalance = async () => {
    if (atm) {
      setInvestmentBalance((await atm.investmentBalance()).toString());
    }
  };

  const getOwner = async () => {
    if (atm) {
      setOwner(await atm.getOwner());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const transferOwnership = async (newOwner) => {
    if (atm) {
      let tx = await atm.transferOwnership(newOwner);
      await tx.wait();
      getOwner();
    }
  };

  const addInvestment = async (amount) => {
    if (atm) {
      let tx = await atm.addInvestment(amount);
      await tx.wait();
      getInvestmentBalance();
    }
  };

  const withdrawInvestment = async (amount) => {
    if (atm) {
      let tx = await atm.withdrawInvestment(amount);
      await tx.wait();
      getInvestmentBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    if (investmentBalance === undefined) {
      getInvestmentBalance();
    }

    if (owner === undefined) {
      getOwner();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Your Investment Balance: {investmentBalance}</p>
        <p>Current Owner: {owner}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={() => addInvestment(1)}>Add Investment 1 ETH</button>
        <button onClick={() => withdrawInvestment(1)}>Withdraw Investment 1 ETH</button>
        <div>
          <input type="text" id="newOwner" placeholder="New Owner Address" />
          <button
            onClick={() =>
              transferOwnership(document.getElementById("newOwner").value)
            }
          >
            Transfer Ownership
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
