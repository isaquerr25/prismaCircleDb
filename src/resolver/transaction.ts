import { PrismaClient } from '@prisma/client';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { InputDeleteTransaction, InputNewTransaction, TransactionAll, InputUpdateTransaction, RequestDeposit, InputTypeTransaction, TransactionUser, InputValidateWithdrawTransaction } from '../dto/transaction';
import { GraphState } from '../dto/utils';
import { createWithdrawToken, decodeTokenTypeWithdraw, getTokenId } from '../utils';
import { valueInCash } from './utils';
import clientPayments from '../payments/centerPayments';
import convert from '../payments/convert';
import { createTransactionPayment } from '../payments/deposit';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { listeners } from 'process';
import { emailWithdrawConfirmSend } from '../systemEmail';
import { createHash } from './document';
export const prisma = new PrismaClient();

@Resolver()
export class TransactionResolver {

	@Query(() => [TransactionAll], { nullable: true })
	async allTransactions() {
		return prisma.transaction.findMany();
	}

	/* -------------------------------------------------------------------------- */
	/*                          All Transactions By User                          */
	/* -------------------------------------------------------------------------- */
	@Query(() => [TransactionAll],{nullable:true})
	async allTransactionsByUser(@Ctx() ctx: any) {
		return prisma.transaction.findMany({where:{userId:getTokenId(ctx)?.userId}});
	}

	/* -------------------------------------------------------------------------- */
	/*                             Create Transaction                             */
	/* -------------------------------------------------------------------------- */
	@Mutation(()=> [GraphState])
	async createTransaction(@Arg('data', () => InputNewTransaction)
		data: InputNewTransaction,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;
		if(!(data.action ==  'WITHDRAW' || data.action =='INVEST')){
			stateReturn.push({
				field: 'error',
				message: 'This type of transaction is not accepted',
			});
			return stateReturn;
		}
		const user = await prisma.user.findFirst({ where: { id: idValid } });

		if (user == null || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
			return stateReturn;
		}

		if(user.wallet == ''){
			stateReturn.push({
				field: 'wallet',
				message: 'Add a wallet to your profile and then continue this transaction',
			});
			return stateReturn;
		}

		data.wallet = user.wallet == null ? '' : user.wallet;

		if(data.wallet == ''){
			stateReturn.push({
				field: 'wallet',
				message: 'Add a wallet to your profile and then continue this transaction',
			});
			return stateReturn;
		}

		if(data.value < 5000 || data.wallet ==''|| data.wallet ==null){

			if (data.value < 5000 ) {
				stateReturn.push({
					field: 'value',
					message: 'value below necessary',
				});
			}
			if (data.wallet ==''|| data.wallet ==null) {
				stateReturn.push({
					field: 'wallet',
					message: 'null',
				});
			}
			return stateReturn;
		}
		console.log(await valueInCash(idValid));
		if((data.action =='INVEST' ||data.action =='WITHDRAW') && data.value > (await valueInCash(idValid))  ){
			stateReturn.push({
				field: 'Value',
				message: 'You do not have enough money to complete this transaction',
			});
		}
		if (stateReturn.length == 0) {
			try {
				data.userId = idValid;
				let createUser:any;
				if(data.action ==  'WITHDRAW'){

					createUser = await prisma.transaction.create({data:{
						action:data.action,
						value:data.value,
						valueBTC:data.valueBTC,
						hash: 'with_draw_'+createHash(),
						wallet:data.wallet,
						userId:data.userId,
						state:'WAIT_VALIDATION_EMAIL'
					}});
					await emailWithdrawConfirmSend(createUser,user.email,user.wallet!);
				}else{
					createUser = await prisma.transaction.create({data});

				}
				console.log(createUser);
				stateReturn.push({
					field: 'success',
					message: 'An email will be sent to confirm the transaction' ,
				});
			} catch {
				stateReturn.push({
					field: 'withdraw',
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

	/* -------------------------------------------------------------------------- */
	/*                               Create Deposit                               */
	/* -------------------------------------------------------------------------- */

	@Mutation(()=> RequestDeposit)
	async createDeposit(@Arg('data', () => InputNewTransaction)
		data: InputNewTransaction,@Ctx() ctx: any){
		interface stateReturnType{
				url:string
				status:{field?:string,message?:string}[]
			}

		const stateReturn:stateReturnType = {
			'url':'',
			'status':[]
		};

		const idValid = getTokenId(ctx)?.userId;

		if(!(data.action =='DEPOSIT')){

			stateReturn.status.push({
				field: 'error',
				message: 'This type of transaction is not accepted',
			});
			return stateReturn;
		}
		const user = await prisma.user.findFirst({ where: { id: idValid } });

		if (user == null || idValid == null) {
			stateReturn.status.push({
				field: 'error',
				message: 'this user not exists',
			});
			return stateReturn;
		}

		if(data.value <5000){
			if (data.value < 5000 ) {
				stateReturn.status.push({
					field: 'value',
					message: 'value below necessary',
				});
			}
		}

		if (stateReturn.status.length == 0){
			try{
				const valueBtcNow = await convert(data.value);
				const objDeposit = {
					currency1: 'BTC',
					currency2: 'BTC',
					amount: valueBtcNow,
					buyer_email: user.email
				};
				const objTransactionPayment =  await createTransactionPayment( clientPayments(),objDeposit);

				data.userId = idValid;
				data.hash = objTransactionPayment.txn_id;
				data.valueBTC = objTransactionPayment.amount;

				const createUser = await prisma.transaction.create({data});

				console.log(createUser);
				stateReturn.url = objTransactionPayment.status_url;
				stateReturn.status.push({
					field: 'success',
					message: 'Click on the button to go to the payment screen' ,
				});
			} catch{
				stateReturn.status.push({
					field: 'create deposit',
					message: 'We cannot complete your transaction right now. Please wait or contact support',
				});
			}
		} else {
			stateReturn.status.push({
				field: 'create',
				message: 'contact the support',
			});
		}
		return stateReturn;
	}


	/* -------------------------------------------------------------------------- */
	/*                             Update Transaction                             */
	/* -------------------------------------------------------------------------- */

	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async updateTransaction(@Arg('data', () => InputUpdateTransaction)
		data: InputUpdateTransaction,@Ctx() ctx: any){

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

	/* -------------------------------------------------------------------------- */
	/*                             Delete Transaction                             */
	/* -------------------------------------------------------------------------- */
	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async deleteTransaction(@Arg('data', () => InputDeleteTransaction)
		data: InputDeleteTransaction,@Ctx() ctx: any){

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



	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [TransactionUser])
	async getTypeTransaction(@Arg('data', () => InputTypeTransaction)
		data: InputTypeTransaction,@Ctx() ctx: any){

		return await prisma.transaction.findMany({
			where: { state: data.state , action: data.action},
			include:{user:true}
		});
	}
	
	@Mutation(()=> GraphState)
	async validWithdraw(@Arg('data', () => InputValidateWithdrawTransaction)
		data: InputValidateWithdrawTransaction){

		console.log(data.token);
		const responseToken = decodeTokenTypeWithdraw(data.token);
		console.log(responseToken);
		try {
			
			await prisma.transaction.update({
				where: { id: responseToken.id},
				data:{state:'PROCESS'}
			});
			return {
				field: 'success',
				message: 'Transaction In Process',
			};

		} catch (error) {
			return {
				field: 'error',
				message: 'Transaction error',
			};
		}
	}
}