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
    address constant public nftRev = 0x50eECbDc306c3e756EFfb022f8E102Ae28294018;
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
        payable(owner).transfer(address(this).balance); // send Metis to the seller
        owner = actualAddress;
    }
}