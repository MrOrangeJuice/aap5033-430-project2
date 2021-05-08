const handleDomo = e => {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

class Coins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoins: 0,
      coinPower: 1,
      storeMessage: "Keep Making Me Money!",
      coinPowerPrice: 20,
      warioUrl: "/assets/img/warioIdle.gif"
    };
    this.incrementCoins = this.incrementCoins.bind(this);
    this.incrementCoinPower = this.incrementCoinPower.bind(this);
    this.incrementCoinsTimer = this.incrementCoinsTimer.bind(this);
  }

  incrementCoins() {
    this.setState({
      playerCoins: this.state.playerCoins + this.state.coinPower
    });
    this.setState({
      storeMessage: "Keep Making Me Money!"
    });
    this.setState({
      warioUrl: "/assets/img/warioIdle.gif"
    });
  }

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
  }

  render() {
    return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/face.png",
        id: "clickerImg",
        onClick: this.incrementCoins
      }), /*#__PURE__*/React.createElement("h2", null, "Coins: ", this.state.playerCoins), /*#__PURE__*/React.createElement("h2", null, "Coin Power: ", this.state.coinPower), /*#__PURE__*/React.createElement("div", {
        id: "store"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: this.incrementCoinPower
      }, "Coin Power +1: ", this.state.coinPowerPrice, " Coins")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
        id: "message"
      }, /*#__PURE__*/React.createElement("img", {
        src: this.state.warioUrl
      }), /*#__PURE__*/React.createElement("h3", null, this.state.storeMessage)), /*#__PURE__*/React.createElement("br", null))
    );
  }

}

const DomoForm = props => {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
};

const DomoList = function (props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos Yet"))
    );
  }

  const domoNodes = props.domos.map(function (domo) {
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: "domo"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, " Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, " Age: ", domo.age, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

const setup = function (csrf) {
  /*
  ReactDOM.render(
      <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
   ReactDOM.render(
      <DomoList domos={[]} />, document.querySelector("#domos")
  );
  */
  ReactDOM.render( /*#__PURE__*/React.createElement(Coins, null), document.querySelector("#coins")); //loadDomosFromServer();
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
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("#domoMessage").animate({
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
