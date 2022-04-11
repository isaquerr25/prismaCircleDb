import fs from 'fs';
import stream from 'stream';
import express from 'express';
import path, { dirname } from 'path';
import {  decodeTokenType } from '../utils';
const routes = express.Router();

import { MyContext } from '../types/MyContext';
import { prisma } from '../resolver/user';
import axios from 'axios';



routes.use('/static', function(req,res, next) {
	res.header('Access-Control-Allow-Origin','*');
	// const context = {
	// 	req,
	// 	res
	// };
	// const businessRole = ['ADMIN','MANAGER','DEVELOPER','TESTER'];

	// if (getTokenId(context)?.role) {
	// 	if (businessRole.includes(getTokenId(context).role) ) {
	// 		next();
	// 	}else{
	// 		throw new Error('not user authenticated');
	// 	}
	// }else{
	// 	throw new Error('not user authenticated');
	// }
	next();

});

routes.use('/static', express.static(path.join(__dirname,'../../images/')));

routes.get('/confirmation/:tokenID', async function(req, res) {
	
	const idPrimary = decodeTokenType(req.params.tokenID).userId;
	console.log(process.env.FRONT_IP!);
	console.log(idPrimary);
	if(idPrimary){
		try{
			await prisma.user.update({
				where: { id: idPrimary },
				data: { confirm: 'valid' },
			});
			return res.redirect(`${process.env.FRONT_IP!}/home/login`);
		}catch(error){
			console.log(error);
			res.status(404);
		}
	}
	res.status(404);
});


routes.get('/exchange', async function(req, res) {
	res.header('Access-Control-Allow-Origin','*');
	let result:any;
	try{

		await axios.get('https://api.bitapi.pro/v1/market/overview').then((res) => {
			console.log(res.data);
			result = res.data;
		});

		res.send(result);

	}catch(error){
		console.log(error);
		res.status(404);
	}
	
});


export default routes;