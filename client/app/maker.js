const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
}

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
        this.setState({playerCoins: this.state.playerCoins + this.state.coinPower});
        this.setState({storeMessage: "Keep Making Me Money!"});
        this.setState({warioUrl: "/assets/img/warioIdle.gif"});
    }

    incrementCoinPower() {
        if(this.state.playerCoins >= this.state.coinPowerPrice)
        {
            this.setState({coinPower: this.state.coinPower + 1});
            this.setState({playerCoins: this.state.playerCoins - this.state.coinPowerPrice});
            this.setState({coinPowerPrice: this.state.coinPowerPrice * 2});
            this.setState({storeMessage: "WAHAHA! Purchase Successful!"});
            this.setState({warioUrl: "/assets/img/warioPurchase.gif"});
        }
        else
        {
            this.setState({storeMessage: "WAAAH! Too Poor!"});
            this.setState({warioUrl: "/assets/img/warioPoor.gif"});
        }
    }

    incrementCoinsTimer() {
        this.setState({playerCoins: this.state.playerCoins + 1});
    }

    render() {
        return (
            <div>
                <img src="/assets/img/face.png" id="clickerImg" onClick={this.incrementCoins}></img>
                <h2>Coins: {this.state.playerCoins}</h2>
                <h2>Coin Power: {this.state.coinPower}</h2>
                <div id="store">
                    <button onClick={this.incrementCoinPower}>Coin Power +1: {this.state.coinPowerPrice} Coins</button>
                </div>
                <br></br>
                <div id="message">
                    <img src={this.state.warioUrl}></img>
                    <h3>{this.state.storeMessage}</h3>
                </div>
                <br></br>
            </div>
        );
    }
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
        
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    /*
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    */
   ReactDOM.render(
    <Coins/>, document.querySelector("#coins")
   );

    //loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});