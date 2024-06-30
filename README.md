# Voting Application

This simple voting program is the application of the previous project adding a simple UI/UX. It applies some of React knowledge as well as previous modules discusss in the Metacrafters module ETH+AVAX.

## Description

This program is a smart contract written in Solidity, a programming language used for developing smart contracts on the Ethereum blockchain. The contract allows users to start a vote, cast votes, and end the vote. Events are emitted to track the state of the voting process. This program serves as a simple and straightforward introduction to Solidity programming and can be used as a stepping stone for more complex projects in the future.

## Getting Started

### Executing Program (Contract-only)

To run this program, you can use Remix, an online Solidity IDE. To get started, go to the Remix website at [https://remix.ethereum.org/](https://remix.ethereum.org/).

1. Once you are on the Remix website, create a new file by clicking on the "+" icon in the left-hand sidebar. Save the file with a `.sol` extension (e.g., `VotingApplication.sol`). Copy and paste the following code into the file:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VotingApplication {
    struct Vote {
        bool isActive;
        mapping(address => bool) hasVoted;
        mapping(bool => uint256) votes;
    }

    mapping(uint256 => Vote) public votes;
    uint256 public nextVoteId;

    // Event declarations
    event VoteStarted(uint256 voteId);
    event VoteCast(uint256 voteId, address voter, bool option);
    event VoteEnded(uint256 voteId, uint256 yesVotes, uint256 noVotes);

    function getNextVoteId() public view returns(uint256) {
        return nextVoteId;
    }

    // Start a new vote
    function startVote() public {
        votes[nextVoteId].isActive = true;
        emit VoteStarted(nextVoteId);
        nextVoteId++;
    }

    // Cast a vote
    function castVote(uint256 voteId, bool option) public {
        require(votes[voteId].isActive, "Voting is not active");
        require(!votes[voteId].hasVoted[msg.sender], "Already voted");

        votes[voteId].hasVoted[msg.sender] = true;
        votes[voteId].votes[option]++;
        emit VoteCast(voteId, msg.sender, option);
    }

    // End the vote
    function endVote(uint256 voteId) public {
        require(votes[voteId].isActive, "Voting is not active or already ended");

        votes[voteId].isActive = false;
        uint256 yesVotes = votes[voteId].votes[true];
        uint256 noVotes = votes[voteId].votes[false];

        emit VoteEnded(voteId, yesVotes, noVotes);
    }

    // Manual revert to demonstrate the revert statement
    function manualRevert(bool shouldRevert) public pure {
        if (shouldRevert) {
            revert("Reverted by user choice.");
        }
    }
}
```


2. To compile the code, click on the "Solidity Compiler" tab in the left-hand sidebar. Make sure the "Compiler" option is set to "0.8.9" (or another compatible version), and then click on the "Compile VotingApplication.sol" button.

3. Once the code is compiled, you can deploy the contract by clicking on the "Deploy & Run Transactions" tab in the left-hand sidebar. Select the "VotingApplication" contract from the dropdown menu, and then click on the "Deploy" button.

4. Once the contract is deployed, you can interact with it by calling the functions `startVote`, `castVote`, and `endVote`.

### Deploying with Hardhat

1. Make sure you have [Node.js](https://nodejs.org/) installed.

2. Install Hardhat by running:
   ```bash
   npm install --save-dev hardhat
   ```

3. Create a `deploy.js` script in the `scripts` directory with the following content:

```javascript
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function main() {
  const initBalance = 1;
  const Assessment = await hre.ethers.getContractFactory("VotingApplication");
  const assessment = await Assessment.deploy();
  await assessment.deployed();

  console.log(`A contract with balance of ${initBalance} eth deployed to ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Deploy the contract by running:
   ```bash
   npx hardhat run scripts/deploy.js
   ```

### Interacting with the Contract in a React Application

1. In your React project, create a file named `index.js` and copy the following content:

```javascript
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/VotingApplication.json";

export default function HomePage() {
  const [voteStatus, setVoteStatus] = useState(undefined);

  const contractAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
  const provider = new ethers.providers.JsonRpcProvider("https://8545-metacrafterc-scmstarter-oc0x3j200wd.ws-us114.gitpod.io/");
  const signer = provider.getSigner();
  const atmABI = atm_abi.abi;
  const atm = new ethers.Contract(contractAddress, atmABI, signer);
  var voterId = 0;

  const startVoting = async() => {
    if(atm){
      let tx = await atm.startVote();
      console.log(tx);
      await tx.wait();
      voterId++;
      setVoteStatus("Started");
    }
  }
  const stopVoting = async() => {
    if(atm){
      let tx = await atm.endVote(voterId);
      await tx.wait();
      voterId++;
      setVoteStatus("Vote Ended");
    }
  }
  const voteTrue  = async() => {
    if(atm){
      let tx = await atm.castVote(voterId, true);
      await tx.wait();
      voterId++;
      setVoteStatus("Voted True");
    }
  }
  const voteFalse = async() => {
    if(atm){
      let tx = await atm.castVote(voterId, false);
      await tx.wait()
      voterId++;
      setVoteStatus("Voted False");
    }
  }

  const initUser = () => {
    return (
      <div>
        <p>Vote Status: {voteStatus}</p>
        <button onClick={startVoting}>Start Voting</button>
        <button onClick={stopVoting}>Stop Voting</button>
        <button onClick={voteTrue}>Vote True</button>
        <button onClick={voteFalse}>Vote False</button>
      </div>
    )
  }

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
```

## Running Everything


1. Inside the project directory, type: `npm i` to install all dependencies
2. Create a new terminal type: `npx hardhat node`
4. Create another terminal and tpye: `npx hardhat run --network localhost scripts/deploy.js`
5. Back in the first terminal, type `npm run dev` to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Authors

Renz Angelo Aguirre

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
