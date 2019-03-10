pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'CertifierRole' to manage this role - add, remove, check
contract CertifierRole {
    using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event CertifierAdded(address indexed account);
  event CertifierRemoved(address indexed account);

  // Define a struct 'certifiers' by inheriting from 'Roles' library, struct Role
  Roles.Role private certifiers;
  // In the constructor make the address that deploys this contract the 1st certifier
  constructor() public {
    _addCertifier(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyCertifier() {
    require(isCertifier(msg.sender));
    _;
  }

  // Define a function 'isCertifier' to check this role
  function isCertifier(address account) public view returns (bool) {
    return certifiers.has(account);
  }

  // Define a function 'addCertifier' that adds this role
  function addCertifier(address account) public onlyCertifier {
    _addCertifier(account);
  }

  // Define a function 'renounceCertifier' to renounce this role
  function renounceCertifier() public {
    _removeCertifier(msg.sender);
  }

  // Define an internal function '_addCertifier' to add this role, called by 'addCertifier'
  function _addCertifier(address account) internal {
    certifiers.add(account);
    emit CertifierAdded(account);
  }

  // Define an internal function '_removeCertifier' to remove this role, called by 'removeCertifier'
  function _removeCertifier(address account) internal {
    certifiers.remove(account);
    emit CertifierRemoved(account);
  }
}