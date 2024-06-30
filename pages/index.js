import {useState, useEffect} from "react";
import {ethers} from "ethers";
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
