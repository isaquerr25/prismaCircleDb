/* -------------------------------------------------------------------------- */
/*                             Create Transaction                             */
/* -------------------------------------------------------------------------- */
interface CoinpaymentsCreateTransactionOpts {
    currency1: string
    currency2: string
    amount: number
    buyer_email: string
    address?: string
    buyer_name?: string
    item_name?: string
    item_number?: string
    invoice?: string
    custom?: string
    ipn_url?: string
    success_url?: string
    cancel_url?: string
  }
export const createTransactionPayment = async(client:any,props:CoinpaymentsCreateTransactionOpts) =>{

	return await client.createTransaction(props);

	/* --------------------------------- return --------------------------------- */
	// {
	//   "amount": "1.21825881",
	//   "txn_id": "d17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c",
	//   "address": "PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx",
	//   "confirms_needed": "5",
	//   "timeout": 5400,
	//   "checkout_url": "https://www.coinpayments.net/index.php?cmd=checkout&id=CPED3H7GIFTDRZ4AICVZXGXZ
	// WH&key=4d7321119c0a533250de336138d4bb14",
	//   "status_url": "https://www.coinpayments.net/index.php?cmd=status&id=CPED3H7GIFTDRZ4AICVZXGXZWH
	// &key=4d7321119c0a533250de336138d4bb14",
	//   "qrcode_url": "https://www.coinpayments.net/qrgen.php?id=CPED3H7GIFTDRZ4AICVZXGXZWH&key=4d7321
	// 119c0a533250de336138d4bb14"
	// }
};

/* -------------------------------------------------------------------------- */
/*                            Get Transaction Info                            */
/* -------------------------------------------------------------------------- */

interface CoinpaymentsGetTxOpts {
  txid: string
  full?: number
}
export const GetTransaction  = async (client:any,props:CoinpaymentsGetTxOpts) => {

	return await client.getTx(props);
	/* --------------------------------- return --------------------------------- */
	// {
	//   "time_created": 1424436678,
	//   "time_expires": 1424442078,
	//   "status": 0,
	//   "status_text": "Waiting for buyer funds...",
	//   "type": "coins",
	//   "coin": "POT",
	//   "amount": 121700023,
	//   "amountf": "1.21700023",
	//   "received": 0,
	//   "receivedf": "0.00000000",
	//   "recv_confirms": 0,
	//   "payment_address": "PWP4gKLRLVQv9dsvcN4sZn5pZaKQGothXm"
	// }

};

/* -------------------------------------------------------------------------- */
/*                            Get Transaction Multi                           */
/* -------------------------------------------------------------------------- */
type CoinpaymentsGetTxMultiOpts = string[];
export const GetMultiTransaction  = async (client:any,props:CoinpaymentsGetTxMultiOpts) => {


	return await client.getTxMulti(props);

	/* --------------------------------- return --------------------------------- */
	// "CPBF23CBUSHKKOMV1OPMRBNEFV": {
	//   "error": "ok",
	//   "amount": "1.21825881",
	//   "txn_id": "d17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c",
	//   "address": "PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx",
	//   "confirms_needed": "5",
	//   "timeout": 5400,
	//   "checkout_url": "https://www.coinpayments.net/index.php?cmd=checkout&id=CPED3H7GIFTDRZ4AICVZXGXZ
	// WH&key=4d7321119c0a533250de336138d4bb14",
	//   "status_url": "https://www.coinpayments.net/index.php?cmd=status&id=CPED3H7GIFTDRZ4AICVZXGXZWH
	// &key=4d7321119c0a533250de336138d4bb14",
	//   "qrcode_url": "https://www.coinpayments.net/qrgen.php?id=CPED3H7GIFTDRZ4AICVZXGXZWH&key=4d7321
	// 119c0a533250de336138d4bb14"
	//}[]

};