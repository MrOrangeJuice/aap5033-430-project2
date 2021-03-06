const getRandomInt = max => {
  return Math.floor(Math.random() * max);
};

class Coins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoins: 0,
      coinPower: 1,
      coinBlocks: 0,
      coinBlockObjects: [],
      storeMessage: "Keep Making Me Money!",
      premiumMessage: "Activate Premium (x2 Multiplier)",
      premiumMultiplier: 1,
      coinPowerPrice: 20,
      coinBlockPrice: 50,
      warioUrl: "/assets/img/warioIdle.gif",
      csrf: props.csrf
    };
    this.incrementCoins = this.incrementCoins.bind(this);
    this.incrementCoinPower = this.incrementCoinPower.bind(this);
    this.incrementCoinsTimer = this.incrementCoinsTimer.bind(this);
    this.incrementCoinBlocks = this.incrementCoinBlocks.bind(this);
    this.activatePremium = this.activatePremium.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
  } // Increment coins


  incrementCoins() {
    this.setState({
      playerCoins: this.state.playerCoins + this.state.coinPower * this.state.premiumMultiplier
    });
    this.setState({
      storeMessage: "Keep Making Me Money!"
    });
    this.setState({
      warioUrl: "/assets/img/warioIdle.gif"
    });
  } // Increment Click Power


  incrementCoinPower() {
    if (this.state.playerCoins >= this.state.coinPowerPrice) {
      this.setState({
        coinPower: this.state.coinPower + 1
      });
      this.setState({
        playerCoins: this.state.playerCoins - this.state.coinPowerPrice
      });
      this.setState({
        coinPowerPrice: this.state.coinPowerPrice * 2
      });
      this.setState({
        storeMessage: "WAHAHA! Purchase Successful!"
      });
      this.setState({
        warioUrl: "/assets/img/warioPurchase.gif"
      });
    } else {
      this.setState({
        storeMessage: "WAAAH! Too Poor!"
      });
      this.setState({
        warioUrl: "/assets/img/warioPoor.gif"
      });
    }
  }

  incrementCoinsTimer() {
    this.setState({
      playerCoins: this.state.playerCoins + 1
    });
  } // Add auto coin block


  incrementCoinBlocks() {
    if (this.state.playerCoins >= this.state.coinBlockPrice) {
      this.setState({
        coinBlocks: this.state.coinBlocks + 1
      });
      this.state.coinBlockObjects.push( /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/coinGif.gif",
        className: "blockGif",
        width: "32px",
        height: "128px"
      }));
      this.setState({
        playerCoins: this.state.playerCoins - this.state.coinBlockPrice
      });
      this.setState({
        coinBlockPrice: this.state.coinBlockPrice * 2
      });
      this.setState({
        storeMessage: "WAHAHA! Purchase Successful!"
      });
      this.setState({
        warioUrl: "/assets/img/warioPurchase.gif"
      });
    } else {
      this.setState({
        storeMessage: "WAAAH! Too Poor!"
      });
      this.setState({
        warioUrl: "/assets/img/warioPoor.gif"
      });
    }
  } // Activate premium subscription


  activatePremium() {
    if (this.state.premiumMultiplier == 1) {
      this.setState({
        storeMessage: "EXCELLENT!! WAHAHAHA!"
      });
      this.setState({
        warioUrl: "/assets/img/warioPremium.gif"
      });
      this.setState({
        premiumMultiplier: 2
      });
      this.setState({
        premiumMessage: "Deactivate Premium"
      });
    } else if (this.state.premiumMultiplier == 2) {
      this.setState({
        premiumMultiplier: 1
      });
      this.setState({
        storeMessage: "WAAAH! My Profits!"
      });
      this.setState({
        warioUrl: "/assets/img/warioNoPremium.gif"
      });
      this.setState({
        premiumMessage: "Activate Premium (x2 Multiplier)"
      });
    }
  } // Save progress


  save() {
    let jsonObj = {
      _csrf: this.state.csrf,
      playerCoins: this.state.playerCoins,
      coinPower: this.state.coinPower,
      coinBlocks: this.state.coinBlocks,
      premiumMultiplier: this.state.premiumMultiplier,
      coinPowerPrice: this.state.coinPowerPrice,
      coinBlockPrice: this.state.coinBlockPrice
    };
    sendAjax('POST', "/save", jsonObj, function () {
      console.log("Saved");
    });
  } // Reset progress


  reset() {
    this.setState({
      playerCoins: 0,
      coinPower: 1,
      coinBlocks: 0,
      coinBlockObjects: [],
      storeMessage: "Keep Making Me Money!",
      premiumMessage: "Activate Premium (x2 Multiplier)",
      premiumMultiplier: 1,
      coinPowerPrice: 20,
      coinBlockPrice: 50,
      warioUrl: "/assets/img/warioIdle.gif"
    });
    this.setState({
      storeMessage: "My Fortune! Data has been reset"
    });
    this.setState({
      warioUrl: "/assets/img/warioReset.gif"
    });
  } // Load account progress


  componentDidMount() {
    sendAjax('GET', "/getUser", null, data => {
      // Load in data
      this.setState({
        playerCoins: data.coins,
        coinPower: data.coinPower,
        coinBlocks: data.coinBlocks,
        coinPowerPrice: data.coinPowerPrice,
        coinBlockPrice: data.coinBlockPrice,
        premiumMultiplier: data.premiumMultiplier
      }); // Remake coin blocks

      for (let i = 0; i < this.state.coinBlocks; i++) {
        this.state.coinBlockObjects.push( /*#__PURE__*/React.createElement("img", {
          src: "/assets/img/coinGif.gif",
          className: "blockGif",
          width: "32px",
          height: "128px"
        }));
      } // Resetup premium button


      if (this.state.premiumMultiplier == 1) {
        this.setState({
          premiumMessage: "Activate Premium (x2 Multiplier)"
        });
      } else if (this.state.premiumMultiplier == 2) {
        this.setState({
          premiumMessage: "Deactivate Premium"
        });
      }
    }); // Set timer for auto coin function

    setInterval(() => this.setState({
      playerCoins: this.state.playerCoins + this.state.coinBlocks * this.state.premiumMultiplier
    }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  } // Render clicker game


  render() {
    return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/face.png",
        id: "clickerImg",
        onClick: this.incrementCoins
      }), /*#__PURE__*/React.createElement("h2", null, "Coins: ", this.state.playerCoins), /*#__PURE__*/React.createElement("h2", null, "Coin Power: ", this.state.coinPower), /*#__PURE__*/React.createElement("div", {
        id: "blocks"
      }, this.state.coinBlockObjects), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
        id: "store"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: this.incrementCoinPower
      }, "Coin Power +1: ", this.state.coinPowerPrice, " Coins"), /*#__PURE__*/React.createElement("button", {
        onClick: this.incrementCoinBlocks
      }, "Auto Coin Block +1: ", this.state.coinBlockPrice, " Coins"), /*#__PURE__*/React.createElement("button", {
        onClick: this.activatePremium
      }, this.state.premiumMessage)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
        id: "message"
      }, /*#__PURE__*/React.createElement("img", {
        src: this.state.warioUrl
      }), /*#__PURE__*/React.createElement("h3", null, this.state.storeMessage)), /*#__PURE__*/React.createElement("div", {
        id: "controls"
      }, /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: this.state.csrf
      }), /*#__PURE__*/React.createElement("button", {
        onClick: this.save
      }, "Save")), /*#__PURE__*/React.createElement("button", {
        onClick: this.reset
      }, "Reset")), /*#__PURE__*/React.createElement("br", null))
    );
  }

}

class Ad extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (/*#__PURE__*/React.createElement("div", {
        class: "ad"
      }, /*#__PURE__*/React.createElement("p", null, "This is an ad"))
    );
  }

}

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Coins, {
    csrf: csrf
  }), document.querySelector("#coins"));
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
const handleError = message => {
  $("#errorMessage").text(message);
  $("#warioMessage").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("#warioMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
