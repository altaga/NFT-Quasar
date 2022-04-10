import React, { Component } from 'react';
import reactAutobind from 'react-autobind';
import { Button, Row, Col, Input, ListGroup, ListGroupItem } from 'reactstrap';
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { connect } from 'react-redux';
import logo from '../assets/logo.png';

function searchInJSON(json, searchTerm) {
    let result = [];
    let avoid = [];
    for (let i = 0; i < json.length; i++) {

        if (JSON.parse(json[i].Data).name.toLowerCase().includes(searchTerm.toLowerCase())) {
            avoid.push(i);
            result.push(json[i]);
        }
    }
    for (let i = 0; i < json.length; i++) {
        if (JSON.parse(json[i].Data).attributes[0].brand.toLowerCase().includes(searchTerm.toLowerCase()) && avoid.indexOf(i) === -1) {
            result.push(json[i]);
        }
    }
    return result;
}

function shuffle(inArray) {
    let tempArray = inArray;
    for (let i = tempArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = tempArray[i];
      tempArray[i] = tempArray[j];
      tempArray[j] = temp;
    }
    return tempArray;
  }

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            elements: [],
            brand: {},
            searchElements: [],
            searchResults: [],
        }
        reactAutobind(this);
        this.unirest = require('unirest');
    }

    async componentDidMount() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('connect', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log("Connect:" + account);
                this.props.set_pubkey_action(account);
            });
            window.ethereum.on('accountsChanged', (accounts) => {
                const account = accounts[0];
                console.log("Change:" + account);
                this.props.set_pubkey_action(account);
            });
        }
        this.unirest('GET', 'https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/getFullDB')
            .end((res) => {
                if (res.error) throw new Error(res.error);
                if (res.body.length > 0) {
                    let temp = this.state.brand;
                    let temp2 = res.body;
                    let temp4 = []
                    for (let i = 0; i < res.body.length; i++) {
                        if (temp[res.body[i]["PubKey"]] === undefined) {
                            temp[res.body[i]["PubKey"]] = 0;
                        }
                        else {
                            temp[res.body[i]["PubKey"]]++;
                        }
                        
                        temp2[i]["Counter"] = temp[res.body[i]["PubKey"]]
                        temp4.push(res.body[i])
                        temp2[i]["index"] = i
                    }
                    this.setState({
                        elements: shuffle(temp2),
                        searchElements: temp4,
                    });
                }
            });
    }



    async enableEthereum() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            this.props.set_pubkey_action(account);
        }
        else {
            alert("Please install MetaMask to use this feature.")
            window.open("https://metamask.io/", "_blank");
        }
    }

    render() {
        return (
            <div className="header-style">
                <br />
                <Row style={{ fontSize: "1.2rem" }}>
                    <Col xs="1">
                        <div style={{ position: "absolute", top: "20px", paddingLeft: "20px" }}>
                            <a className="nostyle" href="/">
                                <img src={logo} alt="logo" style={{ width: "200px" }} />
                            </a>
                        </div>
                    </Col>
                    <Col xs="1">
                        {""}
                    </Col>
                    <Col xs="5">
                        <div style={{ width: "90%", paddingLeft: "5%" }} className="flexbox-style">
                            <Input onClick={() => {
                                this.setState({
                                    searchResults: [],
                                })
                            }} onChange={(event) => {
                                this.setState({
                                    search: event.target.value
                                });
                            }} style={{ borderRadius: "10px 0px 0px 10px", fontSize: "1.5rem" }} type="text"
                                placeholder="Search Product or Brand" />
                            <Button
                                className="quasarButton"
                                onClick={() => {
                                    console.log(searchInJSON(this.state.searchElements, this.state.search))
                                    this.setState({
                                        searchResults: searchInJSON(this.state.searchElements, this.state.search)
                                    });
                                }}
                                style={{ width: "200px", borderRadius: "0px 10px 10px 0px", fontSize: "1.5rem", background: `#000` }}>Search</Button>
                        </div>
                        <div style={{ height: "20px" }}>
                            {
                                this.state.searchResults.length > 0 &&
                                <ListGroup style={{ paddingLeft: "8%", overflowY: "scroll", height: "auto", width: "67%" }}>
                                    {
                                        this.state.searchResults.map((element, index) => {
                                            return (
                                                <ListGroupItem key={index + "lists"} style={{ textAlign: "justify" }}>
                                                    <a className="nostyle" href={`/nft/${element.PubKey}?id=${element.Counter}`}>
                                                        {
                                                            "NFT: " + JSON.parse(element.Data).name + ", brand: " + JSON.parse(element.Data).attributes[0].brand
                                                        }
                                                    </a>
                                                </ListGroupItem>
                                            )
                                        })
                                    }
                                </ListGroup>
                            }
                        </div>
                    </Col>
                    <Col style={{ paddingTop: "8px" }} xs="1">
                        <a className="nostyle" href="/gallery">
                            Explore
                        </a>
                    </Col>
                    <Col style={{ paddingTop: "8px" }} xs="1">
                        <a className="nostyle" href="/scan">
                            QR Scan
                        </a>
                    </Col>
                    {
                        this.props.my_pubkey.pubkey !== "" ?
                            <Col style={{ paddingTop: "8px" }}>
                                <a className="nostyle" href="/upload">
                                    Mint
                                </a>
                            </Col>
                            :
                            <></>
                    }
                    <Col xs="1">
                        <Button className="quasarButton" onClick={this.enableEthereum} style={{ width: "200px", borderRadius: "10px", fontSize: "1.2rem", background: ` #000` }}>{
                            this.props.my_pubkey.pubkey !== "" ?
                                "Connected"
                                :
                                "Connect Wallet"
                        }</Button>
                    </Col>
                    <Col xs="1">
                        {""}
                    </Col>
                </Row>
                <div className="myhr-header" />
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_pubkey_action
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);