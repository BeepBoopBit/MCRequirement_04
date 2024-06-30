// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

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