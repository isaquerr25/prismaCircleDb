
/* -------------------------------------------------------------------------- */
/*                      Anchors
v1.9.6Get Basic Account Information                       */
/* -------------------------------------------------------------------------- */
export const getBasicUser = async (client:any) => {
	return await client.getBasicInfo();
};
/* --------------------------------- return --------------------------------- */
// {
//   "uername": "OrahKokos",
//   "username": "OrahKokos",
//   "merchant_id": "831b8d495071e5b0e1015486f5001150",
//   "email": "marko.paroski.ns@gmail.com",
//   "public_name": "OrahKokos",
//   "time_joined": 1417611250,
//   "kyc_status": false,
//   "swych_tos_accepted": false
// }


/* -------------------------------------------------------------------------- */
/*                                    Rates                                   */
/* -------------------------------------------------------------------------- */

export const ratesUserPayment = async (client:any) => {

	return await client.rates({ short: 0, accepted:1});

};
/* --------------------------------- return --------------------------------- */
// {
//   "BTC": {
//     "is_fiat": 0,
//     "rate_btc": "1.000000000000000000000000",
//     "last_update": "1375473661",
//     "tx_fee": "0.00100000",
//     "status": "online",
//     "name": "Bitcoin",
//     "confirms": "2",
//     "can_convert": 0,
//     "capabilities": ["payments", "wallet", "transfers", "convert"],
//     "explorer": "https://etherscan.io/tx/%txid%"
//   },
//   "LTC": {
//     "is_fiat": 0,
//     "rate_btc": "0.018343387500000000000000",
//     "last_update": "1518463609",
//     "tx_fee": "0.00100000",
//     "status": "online",
//     "name": "Litecoin",
//     "confirms": "3",
//     "can_convert": 0,
//     "capabilities": ["payments", "wallet", "transfers", "convert"],
//     "explorer": "https://etherscan.io/tx/%txid%"
//   },
//   "USD": {
//     "is_fiat": 1,
//     "rate_btc": "0.000114884285404190000000",
//     "last_update": "1518463609",
//     "tx_fee": "0.00000000",
//     "status": "online",
//     "name": "United States Dollar",
//     "confirms": "1",
//     "can_convert": 0,
//     "capabilities": [],
//     "explorer": "https://etherscan.io/tx/%txid%"
//   }
// }


/* -------------------------------------------------------------------------- */
/*                                  Balances                                  */
/* -------------------------------------------------------------------------- */

// interface CoinpaymentsBalancesOpts {
//   all?: number
// }
// await client.balances(options?: CoinpaymentsBalancesOpts)

/* --------------------------------- return --------------------------------- */

// {
//   "BTC": {
//     "balance": 10000000,
//     "balancef": "0.10000000",
//     "status": "available",
//     "coin_status": "online"
//   },
//   "POT": {
//     "balance": 499594333,
//     "balancef": "4.99594333",
//     "status": "available",
//     "coin_status": "online"
//   }
// }