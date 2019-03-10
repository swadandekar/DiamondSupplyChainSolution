// migrating the appropriate contracts
var Roles = artifacts.require("./Roles.sol");
var MinerRole = artifacts.require("./MinerRole.sol");
var CertifierRole = artifacts.require("./CertifierRole.sol");
var JewellerRole = artifacts.require("./JewellerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  // deployer.deploy(Roles);
  // deployer.deploy(MinerRole);
  // deployer.deploy(JewellerRole);  
  // deployer.deploy(CertifierRole);  
  // deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
