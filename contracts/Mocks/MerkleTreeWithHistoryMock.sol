pragma solidity ^0.6.2;

import '../MerkleTreeWithHistory.sol';

contract MerkleTreeWithHistoryMock is MerkleTreeWithHistory {

  function initialize(uint32 _treeLevels) public override initializer {
    MerkleTreeWithHistory.initialize(_treeLevels);
  }

  function insert(bytes32 _leaf) public {
      _insert(_leaf);
  }
}
