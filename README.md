[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [<img src="https://img.shields.io/badge/View-Website-blue">](https://www.nftquasar.online/) [<img src="https://img.shields.io/badge/View-Video-red">](FALTA VIDEO)

#### Live: https://www.nftquasar.online/
### Main Video!: Pending...

# NFT Quasar

Welcome everyone, we are NFT Quasar

A platform and Marketplace where you can NFTize offline assets such as collectibles, sneakers, watches and more.

# Introduction

The online market for luxury, clothing, sneakers, watches and electronics is huge, and will continue to grow and its assets have really appreciated. (pones una imagen de una madre que esté bien pinche cara sin ser originalmente tan cara)

But the number of problems has also grown. Although companies such as Goat and Stockx have gone to great lengths to combat the Fakes market, meaning reproductions sometimes great fake reproductions of a certain asset, they rely on legacy systems and a huge operation to do so.

<img src="https://www.consultancy.eu/illustrations/news/detail/2020-11-19-095145419-Personal-luxury-goods-market-by-generation-_-Personal-luxury-goods-market-by-channel.jpg"> 


And the buyer has also become more and more sophisticated, asking for better and better systems. 

If only we could use some kind of technology to authenticate and provide non-fungible ownership to those buyers.

Enter NFT Quasar, we NFTize collectibles, sneakers, watches and more providing another layer of security and confidence in that process of buying and selling products.
speech.

# Solution 

Here is the system's Architecture:

<img src="https://i.ibb.co/26mPX3k/NFT-Quasar-Diagram.png">

Our webpage is made on React, Evmos works as the main focus as it is the manager of smart contracts and EVM compatibility with Cosmos. In turn, Evmos RPC manages its interactions between smartcontracts and webpage, Metamask works as our way of signing said contracts and providing the way to mint NFT's. On the storage side we use IPFS/Filecoin in adition with NFT.storage to store our NFT data securely and resiliently and also we use some of their API's to call the CID back.

# Technology stack

## Evmos 

Evmos RPC is the base for Minting, buying, trading and everything Smart Contracts on our platform. It bring us great EVM compatibility.

<img src="https://i.ibb.co/BZqq35Y/image.png">

## IPFS/Filecoin:

We use IPFS for the storage of metadata and NFT image files.
This for the process of uploading the image from the website to NFT.storage, which is our main storage service. Apart from that we use it to link to our smart contracts in order to Mint that off-chain real asset.

This is the code on the server to upload the NFT.More details on:

More details on: [Server](./Server/serverv3.js)

        let nft = req.files.nft;
        let my_date = Date.now();
        let dateName = my_date + `.${nft.mimetype.substring(6, nft.mimetype.length)}`;
        await nft.mv('./uploads/' + dateName)
        const file = fs.readFileSync(__dirname + '/uploads/' + dateName);
        let premetadat = {
            name: `${req.headers.name}`,
            external_url: `${req.headers.external_url}`,
            description: `${req.headers.description}`,
            image: new File([file], dateName, { type: `image/${nft.mimetype.substring(6, nft.mimetype.length)}` }),
            attributes: [
            {
                release_date: `${req.headers.release_date}`,
                state: `${req.headers.state}`,
                brand: `${req.headers.brand}`,
                category: `${req.headers.category}`,
            }
            ]
        }
        let metadata = await clientnft.store(premetadat)

- To access this data we use a Evmos RPC provider, obtaining the NFT IPFS URI directly from the Smart Contract, after that a simple get request will give us the data of the metadata.json.

More Details [Scan](./WebPage/src/pages/scan.js)

    code....

- Here is a Screen shot of our NFT.Storage service

<img src="https://i.ibb.co/pwxkPHC/image.png">
