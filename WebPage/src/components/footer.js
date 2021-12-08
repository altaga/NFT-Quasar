import React, { Component } from 'react';
import { Col, Input, Row, Button } from 'reactstrap';
//import { FaDiscord } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import logo from '../assets/logo.png';
import ipfs from '../assets/IPFS.png';
import polygon from '../assets/polygon.png';
import moralis from '../assets/moralis.png';
import { connect } from 'react-redux';

class Footer extends Component {

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div id="footer-content" className="footer-style" style={{ overflowY: "hidden", overflowX: "hidden", fontFamily:"Verdana"}}>
                <div className="myhr2" />
                <br />
                <div id="footer-div1">
                    <Row style={{ fontSize: "1.2rem" }}>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <div style={{ width: "30vw" }}>
                                <div>
                                    Join NFT Quasar Community
                                </div>
                                <p />
                                <Row>
                                    <Col>
                                        <FaTwitter
                                            onClick={() => window.open("https://twitter.com/nft_quasar", "_blank")}
                                            style={{ fontSize: "4rem", color: "white" }}
                                        />
                                    </Col>
                                    <Col>
                                        <FaInstagram
                                            onClick={() => window.open("https://www.instagram.com/dauthenticator", "_blank")}
                                            style={{ fontSize: "4rem", color: "white" }}
                                        />
                                    </Col>
                                    <Col>
                                        <FaFacebook
                                            onClick={() => window.open("https://www.facebook.com/NFT-Quasar-107773498416019", "_blank")}
                                            style={{ fontSize: "4rem", color: "white" }}
                                        />
                                    </Col>
                                    <Col>
                                        <FaYoutube
                                            onClick={() => window.open("https://youtu.be/Q0_sihBl1NI", "_blank")}
                                            style={{ fontSize: "4rem", color: "white" }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <img src={logo} alt="logos" style={{ width: "auto", height: "150px", paddingBottom: "2vh" }} />
                        </Col>
                        <Col>
                            {""}
                        </Col>
                    </Row>
                </div>
                <hr />
                <div id="footer-div2" style={{ paddingBottom: "1vh" }}>
                    <Row>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <div style={{ color: "white", fontWeight: "bolder", fontSize: "1.7rem", width: "40vw" }}>
                                Get the latest news and updates.
                            </div>
                            <div className="flexbox-style">
                                <div>
                                    <Input style={{ borderRadius: "10px 0px 0px 10px", fontSize: "1.5rem", width: "30vw" }} type="email" placeholder="Subscribe and stay up to date" />
                                </div>
                                <div>
                                    <Button className="quasarButton" style={{ width: "12vw", borderRadius: "0px 10px 10px 0px", fontSize: "1.5rem", background: `#000` }}>
                                        Subscribe
                                    </Button>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <div style={{ color: "white", width: "40vw" }}>
                                <Row md="2">
                                    <Col>
                                        <div>
                                            <div style={{ fontSize: "1.3rem", fontWeight: "bolder" }}>
                                                NFT Quasar
                                            </div>
                                            <Col>
                                                <a className="nostyle" href="/gallery">
                                                    Marketplace
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="https://github.com/altaga/NFT Quasar" target="_blank" rel="noopener noreferrer">
                                                    FAQ's
                                                </a>
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                                                Connect
                                            </div>
                                            <Col>
                                                <a className="nostyle" href="https://www.instagram.com/dauthenticator/" target="_blank" rel="noopener noreferrer">
                                                    Instagram
                                                </a>
                                            </Col>

                                            <Col>
                                                <a className="nostyle" href="https://twitter.com/nft_quasar" target="_blank" rel="noopener noreferrer">
                                                    Twitter
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="https://youtu.be/Q0_sihBl1NI" target="_blank" rel="noopener noreferrer">
                                                    YouTube
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="https://www.facebook.com/NFT-Quasar-107773498416019" target="_blank" rel="noopener noreferrer">
                                                    Facebook
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="mailto:nftondemand@yandex.com">
                                                    Contact
                                                </a>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            {""}
                        </Col>
                    </Row>
                </div>
                <div id="footer-div3" style={{ paddingBottom: "2vh" }}>
                    <Row>
                        <Col>
                            Build on <img alt="imagens" src={polygon} height="20px" /> powered by<img alt="imagsens" src={ipfs} height="20px" /> bridged by <img alt="imagens" src={moralis} height="20px" />
                        </Col>
                        <Col>
                            <div style={{ textAlign: "end" }}>
                                <div className="flexbox-style">
                                    <div style={{ paddingRight: "10px" }}>
                                        <a className="nostyle" href="/privacy" target="_blank">
                                            Privacy Policy
                                        </a>
                                    </div>
                                    <div>
                                        <a className="nostyle" href="/terms" target="_blank">
                                            Terms of Use
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey
    }
}

export default connect(mapStateToProps, null)(Footer)