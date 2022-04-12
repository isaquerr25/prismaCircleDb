import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { getTokenId } from '../utils';
import { CycleAll, CycleAllUser, InputDeleteCycle, InputNewCycle, InputUpdateCycle } from '../dto/cycle';
import { PrismaClient } from '@prisma/client';
import convertUSD from '../payments/convert';
import { addDays, addMonths } from 'date-fns';
import { valueInCash } from './utils';
import { createHash } from './document';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { EmailAll, InputDeleteEmailBack, InputEmailBack, InputUpdateEmailBack } from '../dto/emailBack';
import { TransactionResolver } from './transaction';
import emailValidSend from '../systemEmail/index';

const prisma = new PrismaClient();


@Resolver()
export class EmailBackResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [EmailAll], { nullable: true })
	async allEmail() {
		return prisma.emailBack.findMany();
	}

	@Mutation(()=> GraphState)
	async createEmailBack(@Arg('data', () => InputEmailBack) data: InputEmailBack){

	

		try {
				
			const createUser = await prisma.emailBack.create({data:data});
			console.log(createUser);
			return {
				field: 'create',
				message: 'success',
			};

		} catch(error) {

			console.log(error);
			return{
				field: 'create',
				message: error,
			};

		}

		
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(()=> GraphState)
	async updateEmail(@Arg('data', () => InputUpdateEmailBack) data: InputUpdateEmailBack){

		const stateReturn = [];


		if (!await prisma.emailBack.findFirst({ where: { id: data.id } })) {

			return{
				field: 'error',
				message: 'this user not exists',
			};

		}
		try {

			await prisma.emailBack.update({where:{id:data.id}, data});

			return{
				field: 'update',
				message: 'success',
			};

		} catch(error) {

			return{
				field: 'update',
				message: error,
			};

		}
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async deleteEmail(@Arg('data', () => InputDeleteEmailBack) data: InputDeleteEmailBack)
	{

		const stateReturn = [];

		if (!await prisma.emailBack.findFirst({ where: { id: data.id } })) {
			
			return{
				field: 'error',
				message: 'this user not exists',
			};
		}
		
		try {
			await prisma.emailBack.delete({where:{id:data.id}});

			return{
				field: 'delete',
				message: 'success',
			};

		} catch {

			return{
				field: 'delete',
				message: 'error',
			};

		}
	
		return stateReturn;
	}


}