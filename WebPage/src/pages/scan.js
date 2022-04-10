import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardImg, CardSubtitle, CardTitle, Col, Input, Label, Row } from 'reactstrap';
import '../assets/main.css';
import { connect } from 'react-redux';
import { set_contracturl_action } from "../redux/actions/syncActions/updateContractUrlaction"
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import autoBind from 'react-autobind';
import Header from '../components/header';
import QrReader from 'react-qr-reader'
import logoETH from '../assets/explorer.png'
import meterLogo from '../assets/meterLogo.png';
import { abi } from '../contracts/nftContract';

const Web3 = require('web3')
const dataweb3 = new Web3("https://rpctest.meter.io/");

function ipfsTohtml(uri) {
    let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
    let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
    return substring + substring2
}

function timestampToDate(timestamp) {
    return new Date(timestamp).toLocaleString()
}

class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraId: "environment",
            spaceQR: "inline",
            devices: ["back", "frontal"],
            delay: 200,
            loading: false,
            res: "",
            address: "",
            owners: [],
            owner: "",
            price: "",
            date: "",
        }
        autoBind(this);
        this.unirest = require('unirest');
    }

    componentDidMount() {
/*
        this.setState({
            spaceQR: "none",
            loading: true
        })
        this.checkDisplay("0x36Faa4Bc3FA296d5eFd522A3BBf2918d27359040")
*/
    }

    handleScan(data) {
        if (data !== null && data !== undefined && this.state.spaceQR !== "none") {
            this.setState({
                spaceQR: "none",
                loading: true
            })
            this.checkDisplay(data)
        }
    }

    checkDisplay(addr) {
        let self = this;
        const mint_contract = new dataweb3.eth.Contract(abi(), addr);
        mint_contract.methods.price().call().then(price => {
            self.setState({
                price: price
            })
        });
        mint_contract.methods.owner().call().then(owner => {
            self.setState({
                owner: owner
            })
        });
        mint_contract.methods.tokenURI().call().then(URI => {
            console.log(URI)
            this.unirest('GET', URI)
                .end(function (res) {
                    if (res.error) throw new Error(res.error);
                    console.log(res.body);
                    self.setState({
                        spaceQR: "none",
                        loading: false,
                        res: res.body,
                        address: addr,
                        date: res.body.attributes[0].release_date
                    })
                });

        });
    }

    handleError(err) {
        // Nothing
    }

    camSelect(event) {
        let temp = "environment"
        if (event.target.value === "frontal") {
            temp = "user"
        }
        this.setState({
            cameraId: temp
        })
    }

    render() {
        let previewStyle = {
            width: "100%"
        }
        return (
            <div className="App">
                <Header />
                <div className="body-style3" style={{ fontSize: "1.5rem" }}>
                    <div style={{ padding: "20px" }}>
                        <Row md="2">
                            <Col xs="5">
                                {
                                    this.state.spaceQR === "inline" ?
                                        <div style={{ width: "80%" }}>
                                            <Input style={previewStyle} onChange={this.camSelect} type="select" name="select" id="cameraSelect">
                                                {
                                                    this.state.devices.map((number, index) => <option key={index}>{number}</option>)
                                                }
                                            </Input>
                                            <QrReader
                                                delay={this.state.delay}
                                                style={previewStyle}
                                                onError={this.handleError}
                                                onScan={this.handleScan}
                                                facingMode={this.state.cameraId}
                                            />
                                        </div>
                                        :
                                        <div>
                                            {
                                                this.state.res !== "" &&
                                                <img 
                                                width= "70%"
                                                className="quasarButton" style={{ borderRadius: "10px" }} src={ipfsTohtml(this.state.res.image)} />
                                            }
                                        </div>
                                }
                            </Col>
                            <Col xs="7">
                                <div>
                                    {
                                        this.state.spaceQR === "inline" ?
                                            <div style={{ width: "80%" }} className="center-element">
                                            </div>
                                            :
                                            <div style={{ width: "100%" }}>
                                                {
                                                    this.state.res !== "" &&
                                                    <div>
                                                        <Card className="quasarButton" style={{ fontSize: "1.5rem", backgroundColor: "#4d0080" }}>
                                                            <CardHeader>
                                                                {this.state.res.name}
                                                                <p />
                                                                On sale for: {`${dataweb3.utils.fromWei(this.state.price, "ether").substring(0, 6)}`}
                                                                <>
                                                                    &nbsp;
                                                                </>
                                                                <img width="30px" src={meterLogo}></img>
                                                                <p />
                                                            </CardHeader>
                                                            <CardBody>
                                                                {this.state.res.description}
                                                                <p />
                                                            </CardBody>
                                                            <CardFooter>
                                                                <Row>
                                                                    <Col xs="6">
                                                                        Brand: {this.state.res.attributes[0].brand}
                                                                    </Col>
                                                                    <Col xs="6">
                                                                        Year: {this.state.res.attributes[0].release_date}
                                                                    </Col>
                                                                </Row>
                                                            </CardFooter>
                                                        </Card>
                                                        <div className="myhr2" style={{ marginTop: "5vh", marginBottom: "5vh" }} />
                                                        <Row>
                                                            <Col>
                                                                <Button className="quasarButton" style={{ width: "60%", height: "100%", borderRadius: "10px", fontSize: "1.5rem", background: ` #000` }} onClick={() => window.open(`https://scan-warringstakes.meter.io/address/${this.state.address}`, "_blank")}>
                                                                    <div style={{ fontSize: "0.8rem", fontWeight: "bolder" }}>
                                                                        View on
                                                                    </div>
                                                                    <img src={logoETH} alt="logoeth" width="100%" />
                                                                </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button className="quasarButton" style={{ width: "60%", height: "100%", borderRadius: "10px", fontSize: "1.5rem", background: ` #000` }} onClick={() => window.open(this.state.res.external_url, "_blank")}>Brand URL</Button>
                                                            </Col>
                                                        </Row>
                                                        <div className="myhr2" style={{ marginTop: "5vh", marginBottom: "5vh" }} />
                                                        <Card className="quasarButton" style={{ fontSize: "1rem", backgroundColor: "#4d0080" }}>
                                                            <Row md={4}>
                                                                <Col>
                                                                    Event
                                                                </Col>
                                                                <Col>
                                                                    Price
                                                                </Col>
                                                                <Col>
                                                                    From
                                                                </Col>
                                                                <Col>
                                                                    Release Date
                                                                </Col>
                                                            </Row>
                                                            <Row md={4}>
                                                                <Col>
                                                                    {"Mint"}
                                                                </Col>
                                                                <Col>
                                                                    {this.state.price / 1000000000000000000}  <>
                                                                        &nbsp;
                                                                    </>
                                                                    <img width="30px" src={meterLogo}></img>
                                                                </Col>
                                                                <Col>
                                                                    <a href={`https://scan-warringstakes.meter.io/address/${this.state.owner}`}>{this.state.owner.substring(0, 10)}...
                                                                    </a>
                                                                </Col>
                                                                <Col>
                                                                    {this.state.date}
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </div>
                                                }
                                            </div>
                                    }
                                </div>
                            </Col>
                        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Scan);