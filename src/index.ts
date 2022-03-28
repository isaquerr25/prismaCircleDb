import {buildSchema} from 'type-graphql';
import 'reflect-metadata';
import expressPlayground from 'graphql-playground-middleware-express';
import express from 'express';
const cors = require('cors');
import cookieParser = require('cookie-parser');
import { ApolloServer,gql } from 'apollo-server-express';
import { UserResolver } from './resolver/user';
import { TransactionResolver } from './resolver/transaction';
import { CycleResolver } from './resolver/cycle';
import { MonthlyProfitResolver } from './resolver/monthlyProfit';
import { ProfilePictureResolver } from './resolver/document';
import { GraphQLUpload, graphqlUploadExpress} from 'graphql-upload';
import { finished } from 'stream/promises';





(async () => {
	const app = express();
	const corsOptions = {
		origin: 'http://localhost:3000',
		credentials: true,
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
	const corsplayground = {
		origin: 'https://studio.apollographql.com',
		credentials: true
	};

	app.use(cookieParser());
	app.use(graphqlUploadExpress());

	const schema = await buildSchema({
		resolvers: [ProfilePictureResolver,UserResolver,TransactionResolver,CycleResolver,MonthlyProfitResolver], // add this
	});

	const server = new ApolloServer({
		schema,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: ({ req, res }: any) => ({ req, res }),
	});

	await server.start();

	server.applyMiddleware({ app, cors: corsOptions });
	app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

	app.listen(4000, () => {
		console.log(`
		🚀  Server is running!
		🔉  Listening on port 4000
	`);
	});
})();
