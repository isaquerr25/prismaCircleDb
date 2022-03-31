/* -------------------------------------------------------------------------- */
/*                              Create Withdrawal                             */
/* -------------------------------------------------------------------------- */

// export interface CoinpaymentsCreateWithdrawalBaseOpts {
//   amount: number
//   add_tx_fee?: number
//   currency: string
//   currency2?: string
//   dest_tag?: string
//   ipn_url?: string
//   auto_confirm?: number
//   note?: string
// }

// export interface CoinpaymentsCreateWithdrawalMerchantOpts
//   extends CoinpaymentsCreateWithdrawalBaseOpts {
//   address: string
// }

// export interface CoinpaymentsCreateWithdrawalTagOpts
//   extends CoinpaymentsCreateWithdrawalBaseOpts {
//   pbntag: string
// }

// export type CoinpaymentsCreateWithdrawalOpts =
//   | CoinpaymentsCreateWithdrawalMerchantOpts
//   | CoinpaymentsCreateWithdrawalTagOpts;

// await client.createWithdrawal(options: CoinpaymentsCreateWithdrawalOpts)



/* -------------------------------------------------------------------------- */
/*                             Get Withdrawal Info                            */
/* -------------------------------------------------------------------------- */

// interface CoinpaymentsGetWithdrawalInfoOpts {
//   id: string
// }
// await client.getWithdrawalInfo(options: CoinpaymentsGetWithdrawalInfoOpts)
/* --------------------------------- return --------------------------------- */
// {
//   "time_created": 1424436465,
//   "status": 2,
//   "status_text": "Complete",
//   "coin": "POT",
//   "amount": 10000000000,
//   "amountf": "100.00000000",
//   "send_address": "PVtAyX2HgVmYk8BCw9NGvtaDNdkX2phrVA",
//   "send_txid": "b601e7839c4c237f0fac36e93f98d648cfec402b8f8dbce617c675dac247599e"
// }


/* -------------------------------------------------------------------------- */
/*                           Get Withdrawal History                           */
/* -------------------------------------------------------------------------- */

// interface CoinpaymentsGetWithdrawalHistoryOpts {
//   limit?: number
//   start?: number
//   newer?: Date
// }
// await client.getWithdrawalHistory(options?: CoinpaymentsGetWithdrawalHistoryOpts)

/* --------------------------------- return --------------------------------- */
// [
//   {
//     "id": "CWBF3UECUQFCCNFIRUS73G5VON",
//     "time_created": 1498437967,
//     "status": 2,
//     "status_text": "Complete",
//     "coin": "POT",
//     "amount": 100000000,
//     "amountf": "1.00000000",
//     "send_address": "PTVFPeSvccpdnT5PTyXrfU5XR6UShcRJYt",
//     "send_txid": "1e5be68fdac7acafb68082099ba4d1ca2c881866ce8ee575202419ad1ff55bd8"
//   },
//   {
//     "id": "CWBF0ZRSKG8R4ASD7JFXFIS5YH",
//     "time_created": 1498429199,
//     "status": 2,
//     "status_text": "Complete",
//     "coin": "POT",
//     "amount": 10000000,
//     "amountf": "0.10000000",
//     "send_address": "PMmPaNBzQEmJSZ6XYSDeXYxAC8MVJx3nGM",
//     "send_txid": "8d990f0a833c8c61177ed0b0a7e5ff2e3fa03cc28a9cf5d1dfb171c45b0712c3"
//   }
// ]
