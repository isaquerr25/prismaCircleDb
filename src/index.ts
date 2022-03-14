import {buildSchema} from 'type-graphql';
import 'reflect-metadata';
import expressPlayground from 'graphql-playground-middleware-express';
import express from 'express';
import cors from 'cors';
import cookieParser = require('cookie-parser');
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './resolver/user';


(async () => {
	const app = express();
	const corsOptions = {
		origin: 'http://localhost:19006',
		credentials: true,
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	};

	app.use(cookieParser());
	app.use(cors(corsOptions));

	const schema = await buildSchema({
		resolvers: [UserResolver], // add this
	});

	const server = new ApolloServer({
		schema,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: ({ req, res }: any) => ({ req, res }),
	});

	await server.start();

	server.applyMiddleware({ app });

	app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

	app.listen(4000, () => {
		console.log(`
		🚀  Server is running!
		🔉  Listening on port 4000
	`);
	});
})();