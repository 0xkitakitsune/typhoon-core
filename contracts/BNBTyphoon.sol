// Forked from https://tornado.cash

pragma solidity ^0.6.2;

import "./Typhoon.sol";
import "@openzeppelin/contracts/proxy/Initializable.sol";

contract BNBTyphoon is Typhoon {
  function initialize(
    IVerifier _verifier,
    uint256 _denomination,
    uint32 _merkleTreeHeight,
    address _operator
  ) public override initializer {
    Typhoon.initialize(_verifier, _denomination, _merkleTreeHeight, _operator);
  }

  function _processDeposit() internal override {
    require(msg.value == denomination, "invalid BNB amount sent");
  }

  function _processWithdraw(
    address payable _recipient,
    address payable _relayer,
    uint256 _fee,
    uint256 _refund
  ) internal override {
    // sanity checks
    require(msg.value == 0, "message value is supposed to be zero for BNB instance");
    require(_refund == 0, "refund value is supposed to be zero for BNB instance");

    uint256 providerFee = super.calculateFee(denomination);

    (bool success, ) = _recipient.call.value(denomination - _fee - providerFee)("");
    require(success, "payment to _recipient failed");
    if (_fee > 0) {
      (success, ) = _relayer.call.value(_fee)("");
      require(success, "payment to _relayer failed");
    }

    if (providerFee > 0) {
      (success, ) = super.getProviderWallet().call.value(providerFee)("");
      require(success, "payment to provider failed");
    }
  }
}
