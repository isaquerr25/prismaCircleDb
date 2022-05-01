import { config } from 'dotenv';
config();
import {buildSchema} from 'type-graphql';
import 'reflect-metadata';
import expressPlayground from 'graphql-playground-middleware-express';
import express from 'express';
import cors from 'cors';
import cookieParser = require('cookie-parser');
import { ApolloServer,gql } from 'apollo-server-express';
import { UserResolver } from './resolver/user';
import { TransactionResolver } from './resolver/transaction';
import { CycleResolver } from './resolver/cycle';
import { MonthlyProfitResolver } from './resolver/monthlyProfit';
import { DocumentPictureResolver } from './resolver/document';
import { GraphQLUpload, graphqlUploadExpress} from 'graphql-upload';
import { finished } from 'stream/promises';
import serviceRoutine from './serviceRoutine/index';
import { StaffResolver } from './resolver/staff';
import routes from './router';
import nodemailer from 'nodemailer';
import { EmailBackResolver } from './resolver/emailBack';


/* -------------------------------------------------------------------------- */
/*         NOTE ativar novamente         */
/* -------------------------------------------------------------------------- */

serviceRoutine();

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

(async () => {

	const corsOptions = {
		origin: [`${process.env.FRONT_IP}`,
			'https://www.tempestinvest.com',
			'https://tempestinvest.com',
			'https://api.tempestinvest.com',
			'https://api.tempestinvest.com/graphql',
			`${process.env.IP}:${process.env.DOOR}`],
		credentials: true,
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
	// const corsPicture = {
	// 	origin: 'http://localhost:4000',
	// 	credentials: true,
	// 	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	// };
	// const corsplayground = {
	// 	origin: 'https://studio.apollographql.com',
	// 	credentials: true
	// };

	const schema = await buildSchema({
		resolvers: [
			EmailBackResolver,
			StaffResolver,
			DocumentPictureResolver,
			UserResolver,
			TransactionResolver,
			CycleResolver,
			MonthlyProfitResolver
		], // add this
	});

	const server = new ApolloServer({
		schema,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: ({ req, res }: any) => ({ req, res }),
	});
	await server.start();
	const app = express();
	app.use(cookieParser());
	app.use(routes);
	app.use(graphqlUploadExpress());
	server.applyMiddleware({ app, cors:corsOptions });
	app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

	app.listen(process.env.DOOR, () => {
		console.log(`
		🚀  Server is running!
		🔉  Listening on port 4000
	`);
	});
})();
