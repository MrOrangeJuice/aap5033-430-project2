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
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.save = this.save.bind(this);
        this.reset = this.reset.bind(this);
    }

    // Increment coins
    incrementCoins() {
        this.setState({playerCoins: this.state.playerCoins + (this.state.coinPower * this.state.premiumMultiplier)});
        this.setState({storeMessage: "Keep Making Me Money!"});
        this.setState({warioUrl: "/assets/img/warioIdle.gif"});
    }

    // Increment Click Power
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

    // Add auto coin block
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

    // Activate premium subscription
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

    // Save progress
    save() {
        let jsonObj = {
            _csrf: this.state.csrf,
            playerCoins: this.state.playerCoins,
            coinPower: this.state.coinPower,
            coinBlocks: this.state.coinBlocks,
            premiumMultiplier: this.state.premiumMultiplier,
            coinPowerPrice: this.state.coinPowerPrice,
            coinBlockPrice: this.state.coinBlockPrice
        }
        sendAjax('POST', "/save", jsonObj, function() {
            console.log("Saved");
        });
    }

    // Reset progress
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
        this.setState({storeMessage: "My Fortune! Data has been reset"});
        this.setState({warioUrl: "/assets/img/warioReset.gif"});
    }

    // Load account progress
    componentDidMount() {
        sendAjax('GET', "/getUser", null, (data) => {
            // Load in data
            this.setState({
                playerCoins: data.coins,
                coinPower: data.coinPower,
                coinBlocks: data.coinBlocks,
                coinPowerPrice: data.coinPowerPrice,
                coinBlockPrice: data.coinBlockPrice,
                premiumMultiplier: data.premiumMultiplier,
            });

            // Remake coin blocks
            for(let i = 0; i < this.state.coinBlocks; i++)
            {
                this.state.coinBlockObjects.push(<img src="/assets/img/coinGif.gif" className="blockGif" width="32px" height="128px"></img>);
            }
    
            // Resetup premium button
            if(this.state.premiumMultiplier == 1)
            {
                this.setState({premiumMessage: "Activate Premium (x2 Multiplier)"});
            }
            else if(this.state.premiumMultiplier == 2)
            {
                this.setState({premiumMessage: "Deactivate Premium"});
            }
        });
        
        // Set timer for auto coin function
        setInterval(() => this.setState({ playerCoins: this.state.playerCoins + (this.state.coinBlocks * this.state.premiumMultiplier)}), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // Render clicker game
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
                <div id="controls">
                    <form>
                        <input type="hidden" name="_csrf" value={this.state.csrf} />
                        <button onClick={this.save}>Save</button>
                    </form>
                    <button onClick={this.reset}>Reset</button>
                </div>
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

const setup = function(csrf) {
   ReactDOM.render(
    <Coins csrf={csrf}/>, document.querySelector("#coins")
   );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});