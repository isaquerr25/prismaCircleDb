import axios from 'axios';


export default  async (dollar:number,taxZero =false) =>{
	dollar = dollar/100;
	let valueWithTax:number;
	if(!taxZero){
		valueWithTax =dollar + dollar* Number(process.env.TAX != undefined ? process.env.TAX : 0);
	}else{
		valueWithTax =dollar;

	}
	const valueRest =  Number((await axios.get(`https://blockchain.info/tobtc?currency=USD&value=${valueWithTax.toString()}`)).data);

	return valueRest;
};
