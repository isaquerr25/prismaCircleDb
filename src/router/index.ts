import fs from 'fs';
import stream from 'stream';
import express from 'express';
import path, { dirname } from 'path';
import { getTokenId } from '../utils';
const routes = express.Router();

import { MyContext } from '../types/MyContext';



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

export default routes;