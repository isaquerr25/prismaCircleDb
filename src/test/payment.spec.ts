import { config } from 'dotenv';
config();

import clientPayments from '../payments/centerPayments';
import convert from '../payments/convert';


describe('Payment', () => {
	it('user info', async() =>{
		expect(clientPayments()).not.toBeNull();
	});
	it('Convert', async() =>{
		expect(convert(25)).not.toBeNull();
	});
});
