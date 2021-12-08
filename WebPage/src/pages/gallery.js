import '../assets/main.css';
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import { abi } from '../contracts/nftContract';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardTitle, Col, Row } from 'reactstrap';
import { FaChartArea, FaCircle, FaConnectdevelop } from 'react-icons/fa';
import photon from '../assets/photon.png';

const Web3 = require('web3')
const dataweb3 = new Web3("https://ethereum.rpc.evmos.dev");

function sortBybrandA(array) {
  return array.sort(function (a, b) {
    if (JSON.parse(a["Data"]).attributes[0].brand > JSON.parse(b["Data"]).attributes[0].brand) {
      return 1;
    }
    if (JSON.parse(a["Data"]).attributes[0].brand < JSON.parse(b["Data"]).attributes[0].brand) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
}

function sortBybrandD(array) {
  return array.sort(function (a, b) {
    if (JSON.parse(a["Data"]).attributes[0].brand < JSON.parse(b["Data"]).attributes[0].brand) {
      return 1;
    }
    if (JSON.parse(a["Data"]).attributes[0].brand > JSON.parse(b["Data"]).attributes[0].brand) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
}

function sortArraysA(arrays, comparator = (a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) {
  let arrayKeys = Object.keys(arrays);
  let sortableArray = Object.values(arrays)[0];
  let indexes = Object.keys(sortableArray);
  let sortedIndexes = indexes.sort((a, b) => comparator(sortableArray[a], sortableArray[b]));

  let sortByIndexes = (array, sortedIndexes) => sortedIndexes.map(sortedIndex => array[sortedIndex]);

  if (Array.isArray(arrays)) {
    return arrayKeys.map(arrayIndex => sortByIndexes(arrays[arrayIndex], sortedIndexes));
  } else {
    let sortedArrays = {};
    arrayKeys.forEach((arrayKey) => {
      sortedArrays[arrayKey] = sortByIndexes(arrays[arrayKey], sortedIndexes);
    });
    return sortedArrays;
  }
}

function sortArraysD(arrays, comparator = (a, b) => (a > b) ? -1 : (a < b) ? 1 : 0) {
  let arrayKeys = Object.keys(arrays);
  let sortableArray = Object.values(arrays)[0];
  let indexes = Object.keys(sortableArray);
  let sortedIndexes = indexes.sort((a, b) => comparator(sortableArray[a], sortableArray[b]));

  let sortByIndexes = (array, sortedIndexes) => sortedIndexes.map(sortedIndex => array[sortedIndex]);

  if (Array.isArray(arrays)) {
    return arrayKeys.map(arrayIndex => sortByIndexes(arrays[arrayIndex], sortedIndexes));
  } else {
    let sortedArrays = {};
    arrayKeys.forEach((arrayKey) => {
      sortedArrays[arrayKey] = sortByIndexes(arrays[arrayKey], sortedIndexes);
    });
    return sortedArrays;
  }
}

function randomArr(array) {
  return array.sort(function () {
    return 0.5 - Math.random();
  });
}


function parse(array) {
  try {
    let temp = JSON.parse(array).attributes[0].brand;
    return temp
  }
  catch (e) {
    console.log(array);
    return "error";
  }
}

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      brand: {},
      prices: [],
      pric: [],
      status: [],
    }
    autoBind(this);
    this.unirest = require('unirest');
  }

  async componentDidMount() {
    this.unirest('GET', 'https://XXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getFullDB')
      .end((res) => {
        if (res.error) throw new Error(res.error);
        if (res.body.length > 0) {
          let temp = this.state.brand;
          let temp2 = res.body;
          let temp3 = []
          for (let i = 0; i < res.body.length; i++) {
            if (temp[res.body[i]["PubKey"]] === undefined) {
              temp[res.body[i]["PubKey"]] = 0;
            }
            else {
              temp[res.body[i]["PubKey"]]++;
            }
            temp2[i]["Counter"] = temp[res.body[i]["PubKey"]]
            temp3.push("0")
          }
          this.setState({
            elements: temp2,
            prices: temp3
          }, () => {
            for (let i = 0; i < this.state.elements.length; i++) {
              this.updatePrice(this.state.elements[i]["Contract"], i)
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
    mint_contract.methods.price().call().then(price => {
      let temp = this.state.pric;
      temp[id] = parseFloat(dataweb3.utils.fromWei(price, 'ether'));
      this.setState({
        pric: temp
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="body-style2" id="body-style" style={{ overflowX: "hidden" }}>
          <Row style={{ paddingLeft: "1vw", paddingTop: "1vh" }}>
            {
              /*
<Col xs="3" style={{ fontSize: "1.5rem", position: "fixed", paddingTop: "5.5px" }}>
              <Card className="quasarButton" style={{backgroundColor:"#4d0080"}}>
                <div id="price-div" onClick={() => {
                  document.getElementById("price-div2").hidden = !document.getElementById("price-div2").hidden;
                }}>
                  Price
                  <br />
                </div>
                <div id="price-div2">
                  <div>
                    <div style={{ paddingTop: "1vh", paddingBottom: "1vh" }}>
                      <Button className="quasarButton" style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #000` }} onClick={() => {
                        let temp1 = this.state.elements;
                        let temp2 = this.state.prices;
                        let temp4 = this.state.status;
                        let temp3 = sortArraysA([temp2, temp1, temp4]);
                        this.setState({
                          elements: temp3[1],
                          prices: temp3[0],
                          status: temp3[2]
                        });
                      }}>
                        Low to High
                      </Button>
                    </div>
                    <div style={{ paddingTop: "1vh", paddingBottom: "2vh" }}>
                      <Button className="quasarButton" style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #000` }} onClick={() => {
                        let temp1 = this.state.elements;
                        let temp2 = this.state.prices;
                        let temp4 = this.state.status;
                        let temp3 = sortArraysD([temp2, temp1, temp4]);
                        this.setState({
                          elements: temp3[1],
                          prices: temp3[0],
                          status: temp3[2]
                        });
                      }}>
                        High to Low
                      </Button>
                    </div>
                  </div>
                  <br />
                </div>
              </Card>
              <br />
              <Card className="quasarButton" style={{backgroundColor:"#4d0080"}}>
                <div id="brand-div" onClick={() => {
                  document.getElementById("brand-div2").hidden = !document.getElementById("brand-div2").hidden;
                }}>
                  Brand
                  <br />
                </div>
                <div id="brand-div2">
                  <div style={{ paddingTop: "1vh", paddingBottom: "1vh" }}>
                    <Button className="quasarButton" style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #000` }} onClick={() => {
                      this.setState({
                        elements: sortBybrandA(this.state.elements)
                      }, () => {
                        for (let i = 0; i < this.state.elements.length; i++) {
                          this.updatePrice(this.state.elements[i]["Contract"], i)
                        }
                      });
                    }}>
                      A to Z
                    </Button>
                  </div>
                  <div style={{ paddingTop: "1vh", paddingBottom: "2vh" }}>
                    <Button className="quasarButton" style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #000` }} onClick={() => {
                      this.setState({
                        elements: sortBybrandD(this.state.elements)
                      }, () => {
                        for (let i = 0; i < this.state.elements.length; i++) {
                          this.updatePrice(this.state.elements[i]["Contract"], i)
                        }
                      });
                    }}>
                      Z to A
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
              */
            }
            <Col>
              <Row>
                <Col xs={2} />
                <Col xs="8" style={{ paddingTop: "1vh" }}>
                  <Card className="quasarButton" style={{ backgroundColor: "#4d0080" }}>
                    <Row >
                      <Col xs="4" style={{ padding: "1vh" }}>
                        <Row>
                          <Col xs="1" />
                          <Col xs="5">
                            <FaChartArea style={{ fontSize: "3rem", color: "#fff" }} />
                          </Col>
                          <Col xs="5">
                            <div>
                              Total Brands
                            </div>
                            <div>
                              6
                            </div>
                          </Col>
                          <Col xs="1" />
                        </Row>
                      </Col>
                      <Col xs="4" style={{ padding: "1vh" }}>
                        <Row>
                          <Col xs="1" />
                          <Col xs="5">
                            <FaCircle style={{ fontSize: "3rem", color: "#fff" }} />
                          </Col>
                          <Col xs="5">
                            <div>
                              Total Value
                            </div>
                            <div>
                              {
                                this.state.pric.reduce((a, b) => a + b, 0)
                              }
                              <>&nbsp;</>
                              <img width="30px" src={photon}></img>
                            </div>
                          </Col>
                          <Col xs="1" />
                        </Row>
                      </Col>
                      <Col xs="4" style={{ padding: "1vh" }}>
                        <Row>
                          <Col xs="1" />
                          <Col xs="5">
                            <FaConnectdevelop style={{ fontSize: "3rem", color: "#fff" }} />
                          </Col>
                          <Col xs="5">
                            <div>
                              Items Minted
                            </div>
                            <div>
                              {
                                this.state.elements.length
                              }
                            </div>
                          </Col>
                          <Col xs="1" />
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <div className="myhr2" style={{ marginTop: "2vh", marginBottom: "2vh" }} />
                {
                  <>
                    <Row>
                      <Col>
                      <div className="flex-containers">
                      <Row className="inner-elements" md="1" style={{ margin: "10px" }}>
                        <Col style={{ textAlign:"start" }}>
                          <h3>
                            {"Recently Approved"}
                          </h3>
                        </Col>
                        {
                          this.state.elements.map((item, index) => {
                            if (index < 8) {
                              return (
                                <Col style={{ padding: "10px" }} key={"element" + index}>
                                  <a href={`/nft/${item.PubKey}?id=${item.Counter}`} style={{ textDecoration: "none", color: "white" }} target="_blank" >
                                    <Card className="quasarButton" id={"cards" + index} style={{ backgroundColor: "#4d0080", width: "45vw" }}>
                                      <Row md="2">
                                        <Col>
                                          <CardImg className="quasarButton" style={{ width: "80px", height: "80px", borderRadius: "40px", border: "yellow 1px solid" }} top src={item.Url} alt="Card image cap" />
                                        </Col>
                                        <Col style={{ paddingRight: "80px" }}>
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
                                              <img width="30px" src={photon}></img>
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
                      </Col>
                      <Col>
                      <div className="flex-containers">
                      <Row className="inner-elements" md="1" style={{ margin: "10px" }}>
                        <Col style={{ textAlign:"start" }}>
                          <h3>
                            {"Recently Added"}
                          </h3>
                        </Col>
                        {
                          randomArr(this.state.elements).map((item, index) => {
                            if (index < 8) {
                              return (
                                <Col style={{ padding: "10px" }} key={"element" + index}>
                                  <a href={`/nft/${item.PubKey}?id=${item.Counter}`} style={{ textDecoration: "none", color: "white" }} target="_blank" >
                                    <Card className="quasarButton" id={"cards" + index} style={{ backgroundColor: "#4d0080", width: "45vw" }}>
                                      <Row md="2">
                                        <Col>
                                          <CardImg className="quasarButton" style={{ width: "80px", height: "80px", borderRadius: "40px", border: "yellow 1px solid" }} top src={item.Url} alt="Card image cap" />
                                        </Col>
                                        <Col style={{ paddingRight: "80px" }}>
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
                                              <img width="30px" src={photon}></img>
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
                      </Col>
                    </Row>
                  </>
                }
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Gallery;