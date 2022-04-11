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


/* -------------------------------------------------------------------------- */
/*         NOTE ativar novamente         */
/* -------------------------------------------------------------------------- */

// serviceRoutine();

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

const SECRET = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd';
const SECRET_2 = 'ajsdklfjaskljgklasjoiquw01982310nlksas;sdlkfj';
const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';


(async () => {

	const corsOptions = {
		origin: ['http://localhost:3000','http://localhost:4000'],
		credentials: true,
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
	const corsPicture = {
		origin: 'http://localhost:4000',
		credentials: true,
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
	const corsplayground = {
		origin: 'https://studio.apollographql.com',
		credentials: true
	};

	const schema = await buildSchema({
		resolvers: [StaffResolver,DocumentPictureResolver,UserResolver,TransactionResolver,CycleResolver,MonthlyProfitResolver], // add this
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
	server.applyMiddleware({ app, cors: corsOptions });
	app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

	app.listen(4000, () => {
		console.log(`
		🚀  Server is running!
		🔉  Listening on port 4000
	`);
	});
})();
