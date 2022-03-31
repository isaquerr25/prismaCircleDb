

import Coinpayments from 'coinpayments';
export default () => {

	try{
		console.log('start Connect Coinpayments');
		const credentials = {
			key:	process.env.COINPAYMENT_PUBLIC != undefined ? process.env.COINPAYMENT_PUBLIC : '',
			secret: process.env.COINPAYMENT_PRIVATE != undefined ? process.env.COINPAYMENT_PRIVATE : ''
		};

		const client  = new Coinpayments(credentials);
		return client;
	}catch(error){
		console.log('connect Coinpayments ', error );
		return null;
	}
};


// console.log(await client.getBasicInfo());
// console.log(await client.rates({ short: 0, accepted: 1}));
// console.log(await client.balances({ all: 0}));
// console.log(await client.getDepositAddress({ currency: 'BTC'})); // get address wallet

// const CoinpaymentsCreateTransactionOpts = {
// 	currency1: 'BTC',
// 	currency2: 'BTC',
// 	amount: 0.0002,
// 	buyer_email: 'animestuds@gmail.com',
// 	buyer_name: 'nullaaa',
// 	item_name: 'Deposit Storm Invent',
// 	item_number: 5,
// 	invoice: 'null',
// 	custom: 'c',
// 	ipn_url: 'cx',
// 	success_url: 'vv',
// 	cancel_url: 'cxcc',
// };
// console.log(await client.createTransaction(CoinpaymentsCreateTransactionOpts)); // create transaction remember save txn_id to get validate payment
// const CoinpaymentsGetTxOpts = {
// 	txid: 'CPGC3GS7CZUKHDEIFT9DO8OYSF',
// 	full: 1,
// };
// console.log(await client.getTx(CoinpaymentsGetTxOpts));
// status - Status of the payment (-1 = Cancelled, 0 = Pending, 1 == Success)
