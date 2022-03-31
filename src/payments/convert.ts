import axios from 'axios';


export default  async (dollar:number) =>{

	const valueWithTax =dollar + dollar* Number(process.env.TAX != undefined ? process.env.TAX : 0);
	const valueRest =  Number((await axios.get(`https://blockchain.info/tobtc?currency=USD&value=${valueWithTax.toString()}`)).data);

	return valueRest;
};