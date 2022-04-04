import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../types/MyContext';
import { getTokenId } from '../utils';

export const isUserAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {


	if (!getTokenId(context).role) {
		throw new Error('not user authenticated');
	}

	return next();
};
