import React, { Component } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import '../assets/main.css';
import { connect } from 'react-redux';
import { set_contracturl_action } from "../redux/actions/syncActions/updateContractUrlaction"
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import autoBind from 'react-autobind';
import SimpleReactFileUpload from '../components/Upload';
import Header from '../components/header';
import { Grid } from 'react-loading-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { abi, bytecode, content } from '../contracts/nftContract';
import Web3 from 'web3';
import watch from '../assets/watch.png';

var unitMap = {
    'wei': '1',
    'kwei': '1000',
    'ada': '1000',
    'femtoether': '1000',
    'mwei': '1000000',
    'babbage': '1000000',
    'picoether': '1000000',
    'gwei': '1000000000',
    'shannon': '1000000000',
    'nanoether': '1000000000',
    'nano': '1000000000',
    'szabo': '1000000000000',
    'microether': '1000000000000',
    'micro': '1000000000000',
    'finney': '1000000000000000',
    'milliether': '1000000000000000',
    'milli': '1000000000000000',
    'ether': '1000000000000000000',
    'kether': '1000000000000000000000',
    'grand': '1000000000000000000000',
    'einstein': '1000000000000000000000',
    'mether': '1000000000000000000000000',
    'gether': '1000000000000000000000000000',
    'tether': '1000000000000000000000000000000'
};

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finalUrl: '',
            loading: false,
            price: 0,
            currency: 'wei',
            mintButton: true,
            nftNumber: 0,
            nftaws: ""
        }
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.my_pubkey.pubkey !== "" && JSON.stringify(prevProps.my_pubkey.pubkey) !== JSON.stringify(this.props.my_pubkey.pubkey)) {
            this.unirest('GET', 'https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/getDB')
                .headers({
                    'pubkey': this.props.my_pubkey.pubkey
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    this.setState({ nftNumber: res.body.length }, () => {
                        this.props.set_activetab_action(1);
                    });
                });
        }
    }

    componentWillUnmount() {
        clearInterval(this.ETHCheck);
    }

    createContract() {
        this.setState({ loading: true });
        const deploy_contract = new this.web3.eth.Contract(abi());
        // Function Parameter
        let payload = {
            data: "0x" + bytecode()
        }

        let parameter = {
            from: this.props.my_pubkey.pubkey
        }

        // Function Call
        deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        }).on('confirmation', () => { }).then((newContractInstance) => {
            this.props.set_contracturl_action(newContractInstance.options.address);
            this.setState({ loading: false });
            this.props.set_activetab_action(3);
            setTimeout(() => {
                this.props.set_activetab_action(4);
            }, 5000);
        });
    }

    mintNFT() {
        this.setState({ loading: true });
        const mint_contract = new this.web3.eth.Contract(abi(), this.props.my_contracturl.contracturl, { from: this.props.my_pubkey.pubkey });
        mint_contract.methods.mintNFT(this.props.my_ipfslink.ipfslink.nft, (this.state.price * unitMap['ether']).toString()).send().on('transactionHash', (hash) => {
            this.unirest('GET', 'https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/pubDB')
                .headers({
                    'pubkey': this.props.my_pubkey.pubkey,
                    'data': JSON.stringify(this.props.my_nft.nft),
                    'etherscan': `https://scan-warringstakes.meter.io/tx/${hash}`,
                    'contract': this.props.my_contracturl.contracturl,
                    'aws': this.props.my_ipfslink.ipfslink.nftaws
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    this.setState({
                        loading: false,
                        finalUrl: `https://scan-warringstakes.meter.io/tx/${hash}`
                    });
                });
        }).on('confirmation', () => { this.props.set_activetab_action(6) })
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="body-style2" style={{ fontSize: "1.5rem" }}>
                    <div>
                        {
                            this.props.my_activetab.activetab === 0 &&
                            <div style={{ paddingTop: "20vh" }}>
                                <Grid fill="black" />
                                <br />
                                <br />
                                <div>
                                    Waiting for MetaMask to connect...
                                </div>
                                <br />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 1 &&
                            <div style={{ paddingTop: "4vh", width: "98%" }}>
                                <img src={watch} width="10%" />
                                <h2>
                                    How it works?
                                </h2>
                                <br />
                                <div className="myhr2" />
                                <Row md="2">
                                    <Col xs={6} style={{ background: "black", color: "white" }}>
                                        <br />
                                        <h2>Buy</h2>
                                        <p />
                                        <div>
                                            1.Search for the product.
                                        </div>
                                        <p />
                                        <div>
                                            2.Buy or place a bid for the product.
                                        </div>
                                        <p />
                                        <div>
                                            3.Review the NFT history.
                                        </div>
                                        <p />
                                        <div>
                                            4.Get your product and its NFT.
                                        </div>
                                        <br />
                                    </Col>
                                    <Col xs={6} style={{ background: "#4d0080", color: "white" }}>
                                        <br />
                                        <h2>Sell</h2>
                                        <p />
                                        <div>
                                            1.Place your merchandise to sell.
                                        </div>
                                        <p />
                                        <div>
                                            2.Ship your merch.
                                        </div>
                                        <p />
                                        <div>
                                            3.We authenticate & NFTize your product.
                                        </div>
                                        <p />
                                        <div>
                                            4.Get your paid.
                                        </div>
                                    </Col>
                                </Row>
                                <div className="myhr2"/>
                                <br />
                                <Button className="quasarButton" onClick={() => this.props.set_activetab_action(2)} style={{ width: "200px", borderRadius: "25px 25px 25px 25px", fontSize: "1.5rem", background: `#000` }}>
                                    Continue
                                </Button>
                                <br />
                                <br />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 2 &&
                            <div style={{ paddingTop: "5vh" }}>
                                <div>
                                    Deploy NFT contract on Meter.
                                </div>
                                <br />
                                <textarea id="upload1" style={{ fontSize: "1rem", width: "60vw", height: "40vh", overflowY: "scroll", overflowX: "scroll", resize: "none", color:"white",backgroundColor:"#1e1e1e", padding:"10px" }} value={content()} readOnly />
                                <p />
                                <Button className="quasarButton" id="button-upload1" color="primary" style={{ fontSize: "1.5rem", borderRadius: "10px", background: ` #000` }} onClick={() => {
                                    document.getElementById('button-upload1').disabled = true;
                                    document.getElementById('button-upload1').innerHTML = 'Deploying...';
                                    this.createContract();
                                }}>
                                    Deploy Contract
                                </Button>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 3 &&
                            <div style={{ paddingTop: "20vh" }}>
                                <Grid fill="black" />
                                <br />
                                <br />
                                <div>
                                    Waiting for Meter Network
                                </div>
                                <br />
                                <div>
                                    <a href={`https://scan-warringstakes.meter.io/address/${this.props.my_contracturl.contracturl}`} target="_blank" rel="noopener noreferrer">
                                        {this.props.my_contracturl.contracturl}
                                    </a>
                                </div>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 4 &&
                            <div style={{ paddingTop: "12vh" }}>
                                <SimpleReactFileUpload url={"	https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/upload-NFT-Storage"} />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 5 &&
                            <div className="flexbox-style3">
                                <div style={{ paddingTop: "2vh" }}>
                                    <p />
                                    <LazyLoadImage className="quasarButton" style={{borderRadius: "10px"}} width="256" height="256" alt="NFT Loading..." src={this.props.my_ipfslink.ipfslink.nftaws} />
                                    <p />
                                    <Input type="number" name="price" placeholder="Meter price" onChange={(event) => {
                                        if (event.target.value >= 0.0001) {
                                            this.setState({ mintButton: false });
                                            this.setState({ price: event.target.value })
                                        } else {
                                            this.setState({ mintButton: true });
                                        }
                                    }} />
                                    {`Meter value: ${this.state.price}`}
                                    <p />
                                    <Button className="quasarButton" disabled={this.state.mintButton} id="upload3" color="primary" style={{ fontSize: "1.5rem", borderRadius: "10px", background: ` #000` }} onClick={() => {
                                        this.setState({ mintButton: true });
                                        document.getElementById('upload3').innerHTML = 'Minting...';
                                        this.mintNFT();
                                    }}>
                                        Mint and Post
                                    </Button>
                                </div>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 6 &&
                            <>
                                <div style={{ paddingTop: "2vh" }}>
                                    <LazyLoadImage className="quasarButton" style={{borderRadius: "10px"}} width="400" height="400" alt="NFT Loading..." src={this.props.my_ipfslink.ipfslink.nftaws} />
                                </div>
                                <div style={{ paddingTop: "3vh" }}>
                                    <Button className="quasarButton" style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem", borderRight: "1px solid black", background: ` #000` }} onClick={() => window.open(this.state.finalUrl, "_blank")}>View on Meter Explorer</Button>
                                    {
                                        console.log(this.state.finalUrl)
                                    }
                                    <Button className="quasarButton" style={{ borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #000` }} onClick={() => window.open(`/nft/${this.props.my_pubkey.pubkey}?id=${this.state.nftNumber}`, "_blank")}>View on Marketplace</Button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_contracturl_action,
    set_pubkey_action,
    set_activetab_action
}

const mapStateToProps = (state) => {
    return {
        my_contracturl: state.my_contracturl,
        my_pubkey: state.my_pubkey,
        my_ipfslink: state.my_ipfslink,
        my_activetab: state.my_activetab,
        my_nft: state.my_nft
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);