import { PrismaClient } from '@prisma/client';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { InputDeleteTransaction, InputNewTransaction, TransactionAll, InputUpdateTransaction } from '../dto/transaction';
import { GraphState } from '../dto/utils';
import { getTokenId } from '../utils';

export const prisma = new PrismaClient();

@Resolver()
export class TransactionResolver {

	@Query(() => [TransactionAll], { nullable: true })
	async allTransactions() {
		return prisma.transaction.findMany();
	}
	@Query(() => [TransactionAll],{nullable:true})
	async allTransactionsByUser(@Ctx() ctx: any) {
		return prisma.transaction.findMany({where:{userId:getTokenId(ctx)?.userId}});
	}
	@Mutation(()=> [GraphState])
	async createTransaction(@Arg('data', () => InputNewTransaction) data: InputNewTransaction,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;

		if (!await prisma.user.findFirst({ where: { id: idValid } }) || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
			return stateReturn;
		}

		if(data.action =='' || data.value ==0 || data.state =='' || data.wallet ==''){

			if (data.action =='') {
				stateReturn.push({
					field: 'action',
					message: 'null',
				});
			}
			if (data.value ==0 ) {
				stateReturn.push({
					field: 'value',
					message: 'value below necessary',
				});
			}
			if (data.state =='') {
				stateReturn.push({
					field: 'state',
					message: 'null',
				});
			}
			if (data.wallet =='') {
				stateReturn.push({
					field: 'wallet',
					message: 'null',
				});
			}
			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {
				data.userId = idValid;
				const createUser = await prisma.transaction.create({data});
				console.log(createUser);
				stateReturn.push({
					field: 'create',
					message: 'success',
				});
			} catch {
				stateReturn.push({
					field: 'create',
					message: 'error',
				});
			}
		} else {
			stateReturn.push({
				field: 'create',
				message: 'contact the support',
			});
		}

		return stateReturn;
	}

	@Mutation(()=> [GraphState])
	async updateTransaction(@Arg('data', () => InputUpdateTransaction) data: InputUpdateTransaction,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;

		if (!await prisma.user.findFirst({ where: { id: idValid } }) || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
			return stateReturn;
		}

		if(data.id ==null){


			stateReturn.push({
				field: 'transaction',
				message: 'not exists',
			});

			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {

				const createUser = await prisma.transaction.update({where:{id:data.id}, data});
				console.log(createUser);
				stateReturn.push({
					field: 'update',
					message: 'success',
				});
			} catch {
				stateReturn.push({
					field: 'update',
					message: 'error',
				});
			}
		} else {
			stateReturn.push({
				field: 'update',
				message: 'error contact the support',
			});
		}
		return stateReturn;
	}

	@Mutation(()=> [GraphState])
	async deleteTransaction(@Arg('data', () => InputDeleteTransaction) data: InputDeleteTransaction,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;

		if (!await prisma.user.findFirst({ where: { id: idValid } }) || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
			return stateReturn;
		}

		if(data.id ==null){


			stateReturn.push({
				field: 'transaction',
				message: 'not exists',
			});

			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {
				const createUser = await prisma.transaction.delete({where:{id:data.id}});
				console.log(createUser);
				stateReturn.push({
					field: 'delete',
					message: 'success',
				});
			} catch {
				stateReturn.push({
					field: 'delete',
					message: 'error',
				});
			}
		} else {
			stateReturn.push({
				field: 'delete',
				message: 'error contact the support',
			});
		}
		return stateReturn;
	}

}