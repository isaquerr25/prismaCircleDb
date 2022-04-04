import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../types/MyContext';
import { getTokenId } from '../utils';

export const isManagerAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
	const businessRole = ['ADMIN','MANAGER','DEVELOPER','TESTER'];

	if (getTokenId(context)?.role) {
		if (businessRole.includes(getTokenId(context).role) ) {
			return next();
		}
	}

	throw new Error('not user authenticated');
};
