App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originMinerID: "0x0000000000000000000000000000000000000000",
    originMinerName: null,
    diamondColor: null,
    diamondLength: null,
    diamondWidth: null,
    diamondCarat: null,
    diamondNotes: null,
    diamondPrice: 0,
    jewellerID: "0x0000000000000000000000000000000000000000",
    certifierID: "0x0000000000000000000000000000000000000000",
    finalOwnerID: "0x0000000000000000000000000000000000000000",



    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originMinerID = $("#originMinerID").val();
        App.originMinerName = $("#originMinerName").val();
        App.diamondColor = $("#diamondColor").val();
        App.diamondLength = $("#diamondLength").val();
        App.diamondWidth = $("#diamondWidth").val();
        App.diamondCarat = $("#diamondCarat").val();
        App.diamondNotes = $("#diamondNotes").val();
        App.diamondPrice = $("#diamondPrice").val();
        App.jewellerID = $("#jewellerID").val();
        App.certifierID = $("#certifierID").val();
        App.finalOwnerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originMinerID, 
            App.originMinerName, 
            App.diamondColor, 
            App.diamondLength, 
            App.diamondWidth, 
            App.diamondCarat,
            App.diamondNotes, 
            App.diamondPrice, 
            App.jewellerID, 
            App.certifierID, 
            App.finalOwnerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.mineDiamond(event);
                break;
            case 2:
                return await App.putRawDiamondForSale(event);
                break;
            case 3:
                return await App.buyRawDiamond(event);
                break;
            case 4:
                return await App.polishDiamond(event);
                break;
            case 5:
                return await App.certifyDiamond(event);
                break;
            case 6:
                return await App.addDiamondForAuction(event);
                break;
            case 7:
                return await App.purchaseDiamond(event);
                break;
            case 8:
                return await App.fetchItemBufferOne(event);
                break;
            case 9:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    mineDiamond: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.mineDiamond(
                App.upc, 
                App.metamaskAccountID,
                App.metamaskAccountID,
                //ownerId, minerId 
                App.originMinerName, 
                App.diamondColor,
                App.diamondLength, 
                App.diamondWidth,
                App.diamondCarat, 
                App.diamondNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('mineDiamond',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    putRawDiamondForSale: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const diamondPrice = web3.toWei(1, "ether");
            console.log('productPrice',diamondPrice);
            return instance.putRawDiamondForSale(App.upc, App.diamondPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('putRawDiamondForSale',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    buyRawDiamond: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");            
            return instance.buyRawDiamond(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyRawDiamond',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    polishDiamond: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.polishDiamond(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('polishDiamond',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    certifyDiamond: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.certifyDiamond(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('certifyDiamond',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addDiamondForAuction: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const diamondPrice = web3.toWei(1, "ether");
            console.log('productPrice',diamondPrice);
            return instance.addDiamondForAuction(App.upc, App.diamondPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addDiamondForAuction',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseDiamond: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");       
            return instance.purchaseDiamond(App.upc, {from: App.metamaskAccountID,  value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseDiamond',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
