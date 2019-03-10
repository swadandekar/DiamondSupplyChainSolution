pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'JewellerRole' to manage this role - add, remove, check
contract JewellerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event JewellerAdded(address indexed account );
  event JewellerRemoved(address indexed account);

  // Define a struct 'jewellers' by inheriting from 'Roles' library, struct Role
  Roles.Role private jewellers;

  // In the constructor make the address that deploys this contract the 1st jeweller
  constructor() public {
    _addJeweller(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyJeweller() {
    require(isJeweller(msg.sender));
    _;
  }

  // Define a function 'isJeweller' to check this role
  function isJeweller(address account) public view returns (bool) {
    return jewellers.has(account);
  }

  // Define a function 'addJeweller' that adds this role
  function addJeweller(address account) public onlyJeweller {
    _addJeweller(account);
  }

  // Define a function 'renounceJeweller' to renounce this role
  function renounceJeweller() public {
    _removeJeweller(msg.sender);
  }

  // Define an internal function '_addJeweller' to add this role, called by 'addJeweller'
  function _addJeweller(address account) internal {
    jewellers.add(account);
    emit JewellerAdded(account);
  }

  // Define an internal function '_removeJeweller' to remove this role, called by 'removeJeweller'
  function _removeJeweller(address account) internal {
    jewellers.remove(account);
    emit JewellerRemoved(account);
  }
}