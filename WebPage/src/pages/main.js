// Basic imports
import '../assets/main.css';
import { Component } from 'react';
import autoBind from 'react-autobind';
import Footer from '../components/footer';
import Header from '../components/header';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Col, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import gif from '../assets/gif.gif';
import { abi } from '../contracts/nftContract';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import maticToken from "../assets/matic-token.png"
import { FaFileInvoiceDollar, FaImage, FaPalette, FaUpload } from 'react-icons/fa';
import one from "../assets/Icons/1.png"
import two from "../assets/Icons/2.png"
import three from "../assets/Icons/3.png"
import four from "../assets/Icons/4.png"
import five from "../assets/Icons/5.png"
import six from "../assets/Icons/6.png"
import prods from '../assets/prods.png';
import meterLogo from '../assets/meterLogo.png';

const Web3 = require('web3')
const dataweb3 = new Web3("https://rpctest.meter.io/");

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

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      brand: {},
      prices: [],
      status: [],
      search: "",
      searchElements: [],
      searchResults: [],
    }
    autoBind(this);
    this.unirest = require('unirest');
  }

  async componentDidMount() {
    this.unirest('GET', 'https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/getFullDB')
      .end((res) => {
        if (res.error) throw new Error(res.error);
        if (res.body.length > 0) {
          let temp = this.state.brand;
          let temp2 = res.body;
          let temp3 = []
          let temp4 = []
          for (let i = 0; i < res.body.length; i++) {
            if (temp[res.body[i]["PubKey"]] === undefined) {
              temp[res.body[i]["PubKey"]] = 0;
            }
            else {
              temp[res.body[i]["PubKey"]]++;
            }
            temp2[i]["Counter"] = temp[res.body[i]["PubKey"]]
            temp3.push("0")
            temp4.push(res.body[i])
            temp2[i]["index"] = i
          }
          this.setState({
            elements: shuffle(temp2),
            prices: temp3,
            searchElements: temp4,
          }, () => {
            for (let i = 0; i < res.body.length; i++) {
              this.updatePrice(res.body[i]["Contract"], i)
            }
          });
        }
      });
  }

  updatePrice(contract, id) {
    const mint_contract = new dataweb3.eth.Contract(abi(), contract);
    mint_contract.methods.flag().call().then(status => {
      let temp = this.state.status;
      temp[id] = status;
      this.setState({
        status: temp
      });
    });
    mint_contract.methods.price().call().then(price => {
      let temp = this.state.prices;
      temp[id] = price;
      this.setState({
        prices: temp
      });
    });
  }

  render() {
    return (
      <div className="App" style={{ overflowX: "hidden" }}>
        <Header />
        <div className="body-style" id="body-style" style={{ overflowX: "hidden", overflowY: "hidden" }}>
          <br/>
          <div style={{ fontSize: "2rem" }}>
            A platform and Marketplace where you can NFTize offline assets such as collectibles, sneakers, watches and more.
          </div>
          <div>
            <Row md={2} style={{ paddingBottom: "2vh" }}>
              <Col style={{ borderRadius: "50px", padding: "50px" }} xs={6}>
                {
                  this.state.elements.map((item, index) => {
                    if (index < 1) {
                      return (
                        <a key={index + "ok"} href={`/nft/${item.PubKey}?id=${item.Counter}`} style={{ textDecoration: "none" }} target="_blank" onMouseOver={() => {
                          document.getElementById("product" + index).hidden = false;
                        }}
                          onMouseOut={() => {
                            document.getElementById("product" + index).hidden = true;
                          }}>
                          <div className="main-container">
                            <img style={{ borderRadius: "50px" }} src={item.Url} width="700px" height="700px" alt="Card image cap" />
                            <div hidden={true} id={"product" + index} className="main-centered">{
                              JSON.parse(item.Data).name
                            }</div>
                          </div>
                        </a>
                      )
                    }
                  })
                }
              </Col>
              <Col xs={6}>
                <Row>
                  {
                    this.state.elements.map((item, index) => {
                      if (index >= 1 && index < 5) {
                        return (
                          <Col key={index+"productss"} style={{ borderRadius: "50px", padding: "50px" }} xs={6}>
                            <a href={`/nft/${item.PubKey}?id=${item.Counter}`} style={{ textDecoration: "none" }} target="_blank" onMouseOver={() => {
                              document.getElementById("product" + index).hidden = false;
                            }}
                              onMouseOut={() => {
                                document.getElementById("product" + index).hidden = true;
                              }}>
                              <div className="main-container">
                                <img style={{ borderRadius: "50px" }} key={index + "ok"} src={item.Url} width="300px" height="300px" alt="Card image cap" />
                                <div hidden={true} id={"product" + index} className="main-centered">{
                                  JSON.parse(item.Data).name
                                }</div>
                              </div>
                            </a>
                          </Col>
                        )
                      }
                    })
                  }
                </Row>
              </Col>
            </Row>
            <div className="myhr2" />
            <div style={{ paddingTop: "4vh" }}>
              <h1>
                Top Products
              </h1>
            </div>
            <br />
            <div className="flex-containers">
              <Row className="inner-elements" md="5" style={{ margin: "10px" }}>
                {
                  this.state.elements.map((item, index) => {
                    if (index >= 0 && index < 10) {
                      return (
                        <Col key={"element" + index}>
                          <a href={`/nft/${item.PubKey}?id=${item.Counter}`} style={{ textDecoration: "none", color:"white" }} target="_blank" >
                          <Card className="quasarButton" id={"cards" + index} style={{ backgroundColor: "#4d0080", width: "18vw" }}>
                            <Row md="2">
                              <Col>
                                <CardImg className="quasarButton" style={{ width: "80px", height: "80px", borderRadius: "40px", border: "yellow 1px solid" }} top src={item.Url} alt="Card image cap" />
                              </Col>
                              <Col style={{paddingRight:"40px"}}>
                                <CardTitle tag="h4">{JSON.parse(item.Data).attributes[0].brand}</CardTitle>
                                <CardSubtitle tag="h4" >
                                  <div className="flexbox-style">
                                    <div>
                                      {"Price:"}
                                      <>&nbsp;</>
                                    </div>
                                    <div>
                                      {
                                        this.state.prices[index] === "0" ?
                                          "....."
                                          :
                                          dataweb3.utils.fromWei(this.state.prices[index], 'ether').substring(0, 6)
                                      }
                                    </div>
                                    <>&nbsp;</>
                                    <img width="30px" src={meterLogo}></img>
                                  </div>
                                </CardSubtitle>
                              </Col>
                            </Row>
                          </Card>
                          </a>
                        </Col>
                      )
                    }
                    else {
                      return null;
                    }
                  })
                }
              </Row>
            </div>
            <br />
            {
              /*
              <br />
                          <div className="myhr2" />
                          <div style={{ paddingTop: "4vh" }}>
                            <div>
                              <h1>
                                NFTize everything!
                              </h1>
                            </div>
                            <Row md="3" style={{ padding: "4vh" }}>
                              <Col>
                                <div style={{ paddingBottom: "10px" }}>
                                  <CardImg className="quasarButton" style={{ width: "190px", height: "190px", borderRadius: "10px", border: "black 1px solid" }} top src={one} alt="Card image cap" />
                                </div>
                                <div style={{ padding: "0px 20px 0px 20px" }}>
                                  Validated and verified through Polygon.
                                </div>
                              </Col>
                              <Col>
                                <div style={{ paddingBottom: "10px" }}>
                                  <CardImg className="quasarButton" style={{ width: "190px", height: "190px", borderRadius: "10px", border: "black 1px solid" }} top src={two} alt="Card image cap" />
                                </div>
                                <div style={{ padding: "0px 20px 0px 20px" }}>
                                  Real time market place allowing you to buy and sell the most coveted items at their true market price.
                                </div>
                              </Col>
                              <Col>
                                <div style={{ paddingBottom: "10px" }}>
                                  <CardImg className="quasarButton" style={{ width: "190px", height: "190px", borderRadius: "10px", border: "black 1px solid" }} top src={three} alt="Card image cap" />
                                </div>
                                <div style={{ padding: "0px 20px 0px 20px" }}>
                                  Allow you to easily secure those hard-to-find, coveted items.
                                </div>
                              </Col>
                              <Col>
                                <div style={{ paddingBottom: "10px", paddingTop: "20px" }}>
                                  <CardImg className="quasarButton" style={{ width: "190px", height: "190px", borderRadius: "10px", border: "black 1px solid" }} top src={four} alt="Card image cap" />
                                </div>
                                <div style={{ padding: "0px 20px 0px 20px" }}>
                                  We handle everything to make sure you can buy and sell with complete confidence.
                                </div>
                              </Col>
                              <Col>
                                <div style={{ paddingBottom: "10px", paddingTop: "20px" }}>
                                  <CardImg className="quasarButton" style={{ width: "190px", height: "190px", borderRadius: "10px", border: "black 1px solid" }} top src={five} alt="Card image cap" />
                                </div>
                                <div style={{ padding: "0px 20px 0px 20px" }}>
                                  You can check the provenance of the products through the polygon scan.
                                </div>
                              </Col>
                              <Col>
                                <div style={{ paddingBottom: "10px", paddingTop: "20px" }}>
                                  <CardImg className="quasarButton" style={{ width: "190px", height: "190px", borderRadius: "10px", border: "black 1px solid" }} top src={six} alt="Card image cap" />
                                </div>
                                <div style={{ padding: "0px 20px 0px 20px" }}>
                                  We are always available to answer any and every question regarding our marketplace
                                </div>
                              </Col>
                            </Row>
                          </div>
              */
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Main;