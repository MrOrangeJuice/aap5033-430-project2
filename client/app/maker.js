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

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

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
        this.componentDidMount = this.componentDidMount(this);
        this.componentWillUnmount = this.componentWillUnmount(this);
        this.save = this.save.bind(this);
    }

    incrementCoins() {
        this.setState({playerCoins: this.state.playerCoins + (this.state.coinPower * this.state.premiumMultiplier)});
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

    incrementCoinBlocks() {
        if(this.state.playerCoins >= this.state.coinBlockPrice)
        {
            this.setState({coinBlocks: this.state.coinBlocks + 1});
            this.state.coinBlockObjects.push(<img src="/assets/img/coinGif.gif" className="blockGif" width="32px" height="128px"></img>);
            this.setState({playerCoins: this.state.playerCoins - this.state.coinBlockPrice});
            this.setState({coinBlockPrice: this.state.coinBlockPrice * 2});
            this.setState({storeMessage: "WAHAHA! Purchase Successful!"});
            this.setState({warioUrl: "/assets/img/warioPurchase.gif"});
        }
        else
        {
            this.setState({storeMessage: "WAAAH! Too Poor!"});
            this.setState({warioUrl: "/assets/img/warioPoor.gif"});
        }
    }

    activatePremium() {
        if(this.state.premiumMultiplier == 1)
        {
            this.setState({storeMessage: "EXCELLENT!! WAHAHAHA!"});
            this.setState({warioUrl: "/assets/img/warioPremium.gif"});
            this.setState({premiumMultiplier: 2});
            this.setState({premiumMessage: "Deactivate Premium"});
        }
        else if(this.state.premiumMultiplier == 2)
        {
            this.setState({premiumMultiplier: 1});
            this.setState({storeMessage: "WAAAH! My Profits!"});
            this.setState({warioUrl: "/assets/img/warioNoPremium.gif"});
            this.setState({premiumMessage: "Activate Premium (x2 Multiplier)"});
        }
    }

    save() {
        let jsonObj = {
            _csrf: this.state.csrf,
            playerCoins: this.state.playerCoins
        }
        sendAjax('POST', "/save", jsonObj, function() {
            console.log("Saved");
        });
    }

    componentDidMount() {
        console.log("Running");
        sendAjax('GET', "/getUser", null, (data) => {
            this.setState({playerCoins: data.coins});
        });
        setInterval(() => this.setState({ playerCoins: this.state.playerCoins + (this.state.coinBlocks * this.state.premiumMultiplier)}), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <img src="/assets/img/face.png" id="clickerImg" onClick={this.incrementCoins}></img>
                <h2>Coins: {this.state.playerCoins}</h2>
                <h2>Coin Power: {this.state.coinPower}</h2>
                <div id="blocks">
                    {this.state.coinBlockObjects}
                </div>
                <br></br>
                <div id="store">
                    <button onClick={this.incrementCoinPower}>Coin Power +1: {this.state.coinPowerPrice} Coins</button>
                    <button onClick={this.incrementCoinBlocks}>Auto Coin Block +1: {this.state.coinBlockPrice} Coins</button>
                    <button onClick={this.activatePremium}>{this.state.premiumMessage}</button>
                </div>
                <br></br>
                <div id="message">
                    <img src={this.state.warioUrl}></img>
                    <h3>{this.state.storeMessage}</h3>
                </div>
                <form>
                    <input type="hidden" name="_csrf" value={this.state.csrf} />
                    <button onClick={this.save}>Save</button>
                </form>
                <br></br>
            </div>
        );
    }
}

class Ad extends React.Component {
    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <div class="ad">
                <p>This is an ad</p>
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
    <Coins csrf={csrf}/>, document.querySelector("#coins")
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