exports.content = () => {
    return `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
    import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

    contract MyToken is ERC721URIStorage {
        
        address public owner;
        address public actualAddress;
        uint256 public price;
        uint256 public actualBid;
        string public tokenURI;
        bool public flag = false;
        
        // Product Checker 
        address constant public nftRev = 0x793214E59Caa22ef929084c395F2eB1115587fd8;
        bool public revCheck = false;
        bool public cancelFlag = false;
        
        modifier onlyOwner{
            require(msg.sender == owner);
            _; // Close Modifier
        }
        
        modifier onlyRev{
            require(msg.sender == nftRev);
            _; // Close Modifier
        }
        
        constructor() ERC721('NFT', 'MyNFT') {
            owner = msg.sender;
        }
        
        function mintNFT(string memory _tokenURI, uint256 _price) public onlyOwner returns (uint256)
        {
            tokenURI = _tokenURI;
            _mint(owner, 1);
            _setTokenURI(1, tokenURI);
            price = _price;
            flag = true;
            return 1;
        }
        
        function bidUp() public payable {
            require(msg.value > actualBid);
            require(msg.value > price);
            require(flag == true);
            require (cancelFlag == false);
            require(revCheck == true);
            if(actualBid>0){
            payable(actualAddress).transfer(actualBid);  
            }
            actualAddress = msg.sender;
            actualBid = msg.value;
            price = msg.value;
        }
        
        function changePrice(uint256 _price) public onlyOwner {
            require(0 == actualBid);
            price = _price;
        }
        
        function revactivate() public onlyRev{
            revCheck = true;
        }
        
        function activate() public onlyOwner{
            flag = true;
        }
        
        function cancelWbid() public onlyRev payable{
            payable(actualAddress).transfer(actualBid);
            cancelFlag = true;
            flag = false;
        }
        
        function cancelWObid() public onlyRev payable{
            require(actualBid == 0);
            cancelFlag = true;
            flag = false;
        }
        
        function finish() public onlyOwner payable {
            require (cancelFlag == false);
            _transfer(owner, actualAddress, 1);
            actualBid = 0;
            flag = false;
            payable(nftRev).transfer(address(this).balance/50); // Commition
            payable(owner).transfer(address(this).balance); // send Meter to the seller
            owner = actualAddress;
        }
    }
`}

exports.abi = () => {
    return [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "activate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "actualAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "actualBid",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "bidUp",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "cancelFlag",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "cancelWObid",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "cancelWbid",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "changePrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "finish",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flag",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_tokenURI",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "mintNFT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nftRev",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "price",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revCheck",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revactivate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
};

exports.bytecode = () => {
    return (
        "60806040526000600c60006101000a81548160ff0219169083151502179055506000600c60016101000a81548160ff0219169083151502179055506000600c60026101000a81548160ff0219169083151502179055503480156200006257600080fd5b506040518060400160405280600381526020017f4e465400000000000000000000000000000000000000000000000000000000008152506040518060400160405280600581526020017f4d794e46540000000000000000000000000000000000000000000000000000008152508160009080519060200190620000e79291906200014a565b508060019080519060200190620001009291906200014a565b50505033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506200025f565b8280546200015890620001fa565b90600052602060002090601f0160209004810192826200017c5760008555620001c8565b82601f106200019757805160ff1916838001178555620001c8565b82800160010185558215620001c8579182015b82811115620001c7578251825591602001919060010190620001aa565b5b509050620001d79190620001db565b5090565b5b80821115620001f6576000816000905550600101620001dc565b5090565b600060028204905060018216806200021357607f821691505b602082108114156200022a576200022962000230565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6137e2806200026f6000396000f3fe6080604052600436106101cc5760003560e01c80635afa3a72116100f7578063a035b1fe11610095578063bc8e9e1611610064578063bc8e9e1614610613578063c87b56dd1461061d578063d56b28891461065a578063e985e9c514610664576101cc565b8063a035b1fe1461056d578063a22cb46514610598578063a2b40d19146105c1578063b88d4fde146105ea576101cc565b8063890eba68116100d1578063890eba68146104c15780638da5cb5b146104ec57806395d89b411461051757806396af085c14610542576101cc565b80635afa3a721461040a5780636352211e1461044757806370a0823114610484576101cc565b80630f957acb1161016f57806342842e0e1161013e57806342842e0e146103a2578063449107b6146103cb578063449f4ac5146103f657806351c4b35814610400576101cc565b80630f957acb1461030c57806323b872dd146103375780632c6a80a1146103605780633c130d9014610377576101cc565b806307a8759e116101ab57806307a8759e14610264578063081812fc1461028f578063095ea7b3146102cc5780630f15f4c0146102f5576101cc565b8062b2e78a146101d157806301ffc9a7146101fc57806306fdde0314610239575b600080fd5b3480156101dd57600080fd5b506101e66106a1565b6040516101f39190612beb565b60405180910390f35b34801561020857600080fd5b50610223600480360381019061021e91906127e4565b6106b9565b6040516102309190612c52565b60405180910390f35b34801561024557600080fd5b5061024e61079b565b60405161025b9190612c6d565b60405180910390f35b34801561027057600080fd5b5061027961082d565b6040516102869190612c52565b60405180910390f35b34801561029b57600080fd5b506102b660048036038101906102b1919061289a565b610840565b6040516102c39190612beb565b60405180910390f35b3480156102d857600080fd5b506102f360048036038101906102ee91906127a4565b6108c5565b005b34801561030157600080fd5b5061030a6109dd565b005b34801561031857600080fd5b50610321610a54565b60405161032e9190612c52565b60405180910390f35b34801561034357600080fd5b5061035e6004803603810190610359919061268e565b610a67565b005b34801561036c57600080fd5b50610375610ac7565b005b34801561038357600080fd5b5061038c610b30565b6040516103999190612c6d565b60405180910390f35b3480156103ae57600080fd5b506103c960048036038101906103c4919061268e565b610bbe565b005b3480156103d757600080fd5b506103e0610bde565b6040516103ed9190612beb565b60405180910390f35b6103fe610c04565b005b610408610c97565b005b34801561041657600080fd5b50610431600480360381019061042c919061283e565b610d86565b60405161043e9190612e8f565b60405180910390f35b34801561045357600080fd5b5061046e6004803603810190610469919061289a565b610ee7565b60405161047b9190612beb565b60405180910390f35b34801561049057600080fd5b506104ab60048036038101906104a69190612621565b610f99565b6040516104b89190612e8f565b60405180910390f35b3480156104cd57600080fd5b506104d6611051565b6040516104e39190612c52565b60405180910390f35b3480156104f857600080fd5b50610501611064565b60405161050e9190612beb565b60405180910390f35b34801561052357600080fd5b5061052c61108a565b6040516105399190612c6d565b60405180910390f35b34801561054e57600080fd5b5061055761111c565b6040516105649190612e8f565b60405180910390f35b34801561057957600080fd5b50610582611122565b60405161058f9190612e8f565b60405180910390f35b3480156105a457600080fd5b506105bf60048036038101906105ba9190612764565b611128565b005b3480156105cd57600080fd5b506105e860048036038101906105e3919061289a565b61113e565b005b3480156105f657600080fd5b50610611600480360381019061060c91906126e1565b6111b1565b005b61061b611213565b005b34801561062957600080fd5b50610644600480360381019061063f919061289a565b611357565b6040516106519190612c6d565b60405180910390f35b6106626114a9565b005b34801561067057600080fd5b5061068b6004803603810190610686919061264e565b6116cb565b6040516106989190612c52565b60405180910390f35b73793214e59caa22ef929084c395f2eb1115587fd881565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061078457507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061079457506107938261175f565b5b9050919050565b6060600080546107aa906130e5565b80601f01602080910402602001604051908101604052809291908181526020018280546107d6906130e5565b80156108235780601f106107f857610100808354040283529160200191610823565b820191906000526020600020905b81548152906001019060200180831161080657829003601f168201915b5050505050905090565b600c60019054906101000a900460ff1681565b600061084b826117c9565b61088a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161088190612e0f565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006108d082610ee7565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610941576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093890612e4f565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610960611835565b73ffffffffffffffffffffffffffffffffffffffff16148061098f575061098e81610989611835565b6116cb565b5b6109ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c590612d6f565b60405180910390fd5b6109d8838361183d565b505050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a3757600080fd5b6001600c60006101000a81548160ff021916908315150217905550565b600c60029054906101000a900460ff1681565b610a78610a72611835565b826118f6565b610ab7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aae90612e6f565b60405180910390fd5b610ac28383836119d4565b505050565b73793214e59caa22ef929084c395f2eb1115587fd873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b1357600080fd5b6001600c60016101000a81548160ff021916908315150217905550565b600b8054610b3d906130e5565b80601f0160208091040260200160405190810160405280929190818152602001828054610b69906130e5565b8015610bb65780601f10610b8b57610100808354040283529160200191610bb6565b820191906000526020600020905b815481529060010190602001808311610b9957829003601f168201915b505050505081565b610bd9838383604051806020016040528060008152506111b1565b505050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b73793214e59caa22ef929084c395f2eb1115587fd873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c5057600080fd5b6000600a5414610c5f57600080fd5b6001600c60026101000a81548160ff0219169083151502179055506000600c60006101000a81548160ff021916908315150217905550565b73793214e59caa22ef929084c395f2eb1115587fd873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ce357600080fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600a549081150290604051600060405180830381858888f19350505050158015610d4d573d6000803e3d6000fd5b506001600c60026101000a81548160ff0219169083151502179055506000600c60006101000a81548160ff021916908315150217905550565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610de257600080fd5b82600b9080519060200190610df8929190612435565b50610e26600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001611c3b565b610ebb6001600b8054610e38906130e5565b80601f0160208091040260200160405190810160405280929190818152602001828054610e64906130e5565b8015610eb15780601f10610e8657610100808354040283529160200191610eb1565b820191906000526020600020905b815481529060010190602001808311610e9457829003601f168201915b5050505050611e15565b816009819055506001600c60006101000a81548160ff0219169083151502179055506001905092915050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f90576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8790612d8f565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561100a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100190612d4f565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600c60009054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060018054611099906130e5565b80601f01602080910402602001604051908101604052809291908181526020018280546110c5906130e5565b80156111125780601f106110e757610100808354040283529160200191611112565b820191906000526020600020905b8154815290600101906020018083116110f557829003601f168201915b5050505050905090565b600a5481565b60095481565b61113a611133611835565b8383611e89565b5050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461119857600080fd5b600a546000146111a757600080fd5b8060098190555050565b6111c26111bc611835565b836118f6565b611201576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f890612e6f565b60405180910390fd5b61120d84848484611ff6565b50505050565b600a54341161122157600080fd5b600954341161122f57600080fd5b60011515600c60009054906101000a900460ff1615151461124f57600080fd5b60001515600c60029054906101000a900460ff1615151461126f57600080fd5b60011515600c60019054906101000a900460ff1615151461128f57600080fd5b6000600a54111561130657600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600a549081150290604051600060405180830381858888f19350505050158015611304573d6000803e3d6000fd5b505b33600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600a8190555034600981905550565b6060611362826117c9565b6113a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139890612def565b60405180910390fd5b60006006600084815260200190815260200160002080546113c1906130e5565b80601f01602080910402602001604051908101604052809291908181526020018280546113ed906130e5565b801561143a5780601f1061140f5761010080835404028352916020019161143a565b820191906000526020600020905b81548152906001019060200180831161141d57829003601f168201915b50505050509050600061144b612052565b90506000815114156114615781925050506114a4565b60008251111561149657808260405160200161147e929190612bc7565b604051602081830303815290604052925050506114a4565b61149f84612069565b925050505b919050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461150357600080fd5b60001515600c60029054906101000a900460ff1615151461152357600080fd5b611573600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660016119d4565b6000600a819055506000600c60006101000a81548160ff02191690831515021790555073793214e59caa22ef929084c395f2eb1115587fd873ffffffffffffffffffffffffffffffffffffffff166108fc6032476115d19190612fca565b9081150290604051600060405180830381858888f193505050501580156115fc573d6000803e3d6000fd5b50600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015611665573d6000803e3d6000fd5b50600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166118b083610ee7565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611901826117c9565b611940576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161193790612d2f565b60405180910390fd5b600061194b83610ee7565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148061198d575061198c81856116cb565b5b806119cb57508373ffffffffffffffffffffffffffffffffffffffff166119b384610840565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff166119f482610ee7565b73ffffffffffffffffffffffffffffffffffffffff1614611a4a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a4190612caf565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611aba576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ab190612cef565b60405180910390fd5b611ac5838383612110565b611ad060008261183d565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b209190612ffb565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b779190612f74565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611c36838383612115565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611cab576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ca290612dcf565b60405180910390fd5b611cb4816117c9565b15611cf4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ceb90612ccf565b60405180910390fd5b611d0060008383612110565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d509190612f74565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611e1160008383612115565b5050565b611e1e826117c9565b611e5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e5490612daf565b60405180910390fd5b80600660008481526020019081526020016000209080519060200190611e84929190612435565b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611ef8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611eef90612d0f565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611fe99190612c52565b60405180910390a3505050565b6120018484846119d4565b61200d8484848461211a565b61204c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161204390612c8f565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b6060612074826117c9565b6120b3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016120aa90612e2f565b60405180910390fd5b60006120bd612052565b905060008151116120dd5760405180602001604052806000815250612108565b806120e7846122b1565b6040516020016120f8929190612bc7565b6040516020818303038152906040525b915050919050565b505050565b505050565b600061213b8473ffffffffffffffffffffffffffffffffffffffff16612412565b156122a4578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02612164611835565b8786866040518563ffffffff1660e01b81526004016121869493929190612c06565b602060405180830381600087803b1580156121a057600080fd5b505af19250505080156121d157506040513d601f19601f820116820180604052508101906121ce9190612811565b60015b612254573d8060008114612201576040519150601f19603f3d011682016040523d82523d6000602084013e612206565b606091505b5060008151141561224c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161224390612c8f565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149150506122a9565b600190505b949350505050565b606060008214156122f9576040518060400160405280600181526020017f3000000000000000000000000000000000000000000000000000000000000000815250905061240d565b600082905060005b6000821461232b57808061231490613148565b915050600a826123249190612fca565b9150612301565b60008167ffffffffffffffff8111156123475761234661327e565b5b6040519080825280601f01601f1916602001820160405280156123795781602001600182028036833780820191505090505b5090505b60008514612406576001826123929190612ffb565b9150600a856123a19190613191565b60306123ad9190612f74565b60f81b8183815181106123c3576123c261324f565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856123ff9190612fca565b945061237d565b8093505050505b919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b828054612441906130e5565b90600052602060002090601f01602090048101928261246357600085556124aa565b82601f1061247c57805160ff19168380011785556124aa565b828001600101855582156124aa579182015b828111156124a957825182559160200191906001019061248e565b5b5090506124b791906124bb565b5090565b5b808211156124d45760008160009055506001016124bc565b5090565b60006124eb6124e684612ecf565b612eaa565b905082815260208101848484011115612507576125066132b2565b5b6125128482856130a3565b509392505050565b600061252d61252884612f00565b612eaa565b905082815260208101848484011115612549576125486132b2565b5b6125548482856130a3565b509392505050565b60008135905061256b81613750565b92915050565b60008135905061258081613767565b92915050565b6000813590506125958161377e565b92915050565b6000815190506125aa8161377e565b92915050565b600082601f8301126125c5576125c46132ad565b5b81356125d58482602086016124d8565b91505092915050565b600082601f8301126125f3576125f26132ad565b5b813561260384826020860161251a565b91505092915050565b60008135905061261b81613795565b92915050565b600060208284031215612637576126366132bc565b5b60006126458482850161255c565b91505092915050565b60008060408385031215612665576126646132bc565b5b60006126738582860161255c565b92505060206126848582860161255c565b9150509250929050565b6000806000606084860312156126a7576126a66132bc565b5b60006126b58682870161255c565b93505060206126c68682870161255c565b92505060406126d78682870161260c565b9150509250925092565b600080600080608085870312156126fb576126fa6132bc565b5b60006127098782880161255c565b945050602061271a8782880161255c565b935050604061272b8782880161260c565b925050606085013567ffffffffffffffff81111561274c5761274b6132b7565b5b612758878288016125b0565b91505092959194509250565b6000806040838503121561277b5761277a6132bc565b5b60006127898582860161255c565b925050602061279a85828601612571565b9150509250929050565b600080604083850312156127bb576127ba6132bc565b5b60006127c98582860161255c565b92505060206127da8582860161260c565b9150509250929050565b6000602082840312156127fa576127f96132bc565b5b600061280884828501612586565b91505092915050565b600060208284031215612827576128266132bc565b5b60006128358482850161259b565b91505092915050565b60008060408385031215612855576128546132bc565b5b600083013567ffffffffffffffff811115612873576128726132b7565b5b61287f858286016125de565b92505060206128908582860161260c565b9150509250929050565b6000602082840312156128b0576128af6132bc565b5b60006128be8482850161260c565b91505092915050565b6128d08161302f565b82525050565b6128df81613041565b82525050565b60006128f082612f31565b6128fa8185612f47565b935061290a8185602086016130b2565b612913816132c1565b840191505092915050565b600061292982612f3c565b6129338185612f58565b93506129438185602086016130b2565b61294c816132c1565b840191505092915050565b600061296282612f3c565b61296c8185612f69565b935061297c8185602086016130b2565b80840191505092915050565b6000612995603283612f58565b91506129a0826132d2565b604082019050919050565b60006129b8602583612f58565b91506129c382613321565b604082019050919050565b60006129db601c83612f58565b91506129e682613370565b602082019050919050565b60006129fe602483612f58565b9150612a0982613399565b604082019050919050565b6000612a21601983612f58565b9150612a2c826133e8565b602082019050919050565b6000612a44602c83612f58565b9150612a4f82613411565b604082019050919050565b6000612a67602983612f58565b9150612a7282613460565b604082019050919050565b6000612a8a603883612f58565b9150612a95826134af565b604082019050919050565b6000612aad602983612f58565b9150612ab8826134fe565b604082019050919050565b6000612ad0602e83612f58565b9150612adb8261354d565b604082019050919050565b6000612af3602083612f58565b9150612afe8261359c565b602082019050919050565b6000612b16603183612f58565b9150612b21826135c5565b604082019050919050565b6000612b39602c83612f58565b9150612b4482613614565b604082019050919050565b6000612b5c602f83612f58565b9150612b6782613663565b604082019050919050565b6000612b7f602183612f58565b9150612b8a826136b2565b604082019050919050565b6000612ba2603183612f58565b9150612bad82613701565b604082019050919050565b612bc181613099565b82525050565b6000612bd38285612957565b9150612bdf8284612957565b91508190509392505050565b6000602082019050612c0060008301846128c7565b92915050565b6000608082019050612c1b60008301876128c7565b612c2860208301866128c7565b612c356040830185612bb8565b8181036060830152612c4781846128e5565b905095945050505050565b6000602082019050612c6760008301846128d6565b92915050565b60006020820190508181036000830152612c87818461291e565b905092915050565b60006020820190508181036000830152612ca881612988565b9050919050565b60006020820190508181036000830152612cc8816129ab565b9050919050565b60006020820190508181036000830152612ce8816129ce565b9050919050565b60006020820190508181036000830152612d08816129f1565b9050919050565b60006020820190508181036000830152612d2881612a14565b9050919050565b60006020820190508181036000830152612d4881612a37565b9050919050565b60006020820190508181036000830152612d6881612a5a565b9050919050565b60006020820190508181036000830152612d8881612a7d565b9050919050565b60006020820190508181036000830152612da881612aa0565b9050919050565b60006020820190508181036000830152612dc881612ac3565b9050919050565b60006020820190508181036000830152612de881612ae6565b9050919050565b60006020820190508181036000830152612e0881612b09565b9050919050565b60006020820190508181036000830152612e2881612b2c565b9050919050565b60006020820190508181036000830152612e4881612b4f565b9050919050565b60006020820190508181036000830152612e6881612b72565b9050919050565b60006020820190508181036000830152612e8881612b95565b9050919050565b6000602082019050612ea46000830184612bb8565b92915050565b6000612eb4612ec5565b9050612ec08282613117565b919050565b6000604051905090565b600067ffffffffffffffff821115612eea57612ee961327e565b5b612ef3826132c1565b9050602081019050919050565b600067ffffffffffffffff821115612f1b57612f1a61327e565b5b612f24826132c1565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612f7f82613099565b9150612f8a83613099565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612fbf57612fbe6131c2565b5b828201905092915050565b6000612fd582613099565b9150612fe083613099565b925082612ff057612fef6131f1565b5b828204905092915050565b600061300682613099565b915061301183613099565b925082821015613024576130236131c2565b5b828203905092915050565b600061303a82613079565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156130d05780820151818401526020810190506130b5565b838111156130df576000848401525b50505050565b600060028204905060018216806130fd57607f821691505b6020821081141561311157613110613220565b5b50919050565b613120826132c1565b810181811067ffffffffffffffff8211171561313f5761313e61327e565b5b80604052505050565b600061315382613099565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415613186576131856131c2565b5b600182019050919050565b600061319c82613099565b91506131a783613099565b9250826131b7576131b66131f1565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b6137598161302f565b811461376457600080fd5b50565b61377081613041565b811461377b57600080fd5b50565b6137878161304d565b811461379257600080fd5b50565b61379e81613099565b81146137a957600080fd5b5056fea26469706673582212201047bc83d6b7fb62d30a3902b5dccc97bd1399b5e853ab22b71cac1a7717e5d564736f6c63430008070033"
    )
}