import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, UserCash, UserHaveComponents, WalletAlter } from '../dto/user';
import { getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword } from '../utils';
import { validate } from 'bitcoin-address-validation';
import { profitCycle, profitFuture, valueInCash } from './utils';
import { isUserAuth } from '../middleware/isUserAuth';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { InputIdUser, StaffActivity, StaffInfoUserComponents } from '../dto/staff';
import { addDays } from 'date-fns';
import { TransactionAll } from '../dto/transaction';
import { CycleAll } from '../dto/cycle';
export const prisma = new PrismaClient();


enum DocumentRole {
	'INVALID',
	'PROCESS',
	'VALID',
}
@Resolver()
export class StaffResolver {

	GetValidateEmail(email: string) {
		return prisma.user.findFirst({ where: { email } });
	}

	@Mutation(() => [GraphState])
	async loginStaff(

		@Arg('data', () => LoginUser) data: LoginUser,
		@Ctx() ctx: any
	) {

		const businessRole = ['ADMIN','MANAGER','DEVELOPER','TESTER'];
		const newValidateUser: GraphState[] = [];

		const haveEmail = await this.GetValidateEmail(data.email);




		if (haveEmail) {

			if (!businessRole.includes(haveEmail.role.toString())) {

				newValidateUser.push({
					field: 'not Staff',
					message: 'email or password wrong',
				});
				return newValidateUser;
			}

			const coke = await validateLogin(
				haveEmail.password,
				data.password,
				haveEmail.id,
				haveEmail.role.toString()
			);
			console.log('coke =============================>', coke);

			if (coke) {
				const { res } = ctx;

				res.cookie('access-token', coke);

				newValidateUser.push({
					field: 'success',
					message: 'login success',
				});
			} else {
				//password wrong
				newValidateUser.push({
					field: 'access',
					message: 'email or password wrong',
				});
			}
		} else {
			//email wrong
			newValidateUser.push({
				field: 'access',
				message: 'email or password wrong',
			});
		}

		return newValidateUser;
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => StaffActivity,{nullable:true})
	async activeStartStaff() {
		const result:StaffActivity={};

		const allCycle = await prisma.cycle.findMany({where:{state:'PROCESS'}});
		const allWithdrawAll = await prisma.transaction.findMany({where:{state:'PROCESS',action:'WITHDRAW'}});
		const allDocumentsValidate = await prisma.document.findMany({where:{state:'PROCESS'}});

		const allValueEnterToday = await prisma.transaction.findMany({where:{
			state:'COMPLETE',
			action:'DEPOSIT',
			updatedAt:{gte:addDays(new Date(),-1),lte:addDays(new Date(),+1)},
		}});

		result.cyclesStart = allCycle.length ?? 0;
		result.withdrawAll = allWithdrawAll.length ?? 0;
		result.documentsValidate = allDocumentsValidate.length ?? 0;
		result.transactionPay = allValueEnterToday.length ?? 0;
		let soma = 0;
		for (const aloneValueEnterToday of allValueEnterToday){
			soma += Number(aloneValueEnterToday.value);
		}
		result.valueEnterToday = soma;
		return result ;
	}




	@UseMiddleware(isManagerAuth)
	@Mutation(() => [TransactionAll],{nullable:true})
	async allTransactionsByUserStaff(@Arg('data', () => InputIdUser) data: InputIdUser) {
		return prisma.transaction.findMany({where:{userId:data.id}});
	}


	@Mutation(() => [CycleAll],{nullable:true})
	async allCycleByUserStaff(@Arg('data', () => InputIdUser) data: InputIdUser) {
		return prisma.cycle.findMany({where:{userId:data.id}});
	}
	/* -------------------------------------------------------------------------- */


	@UseMiddleware(isManagerAuth)
	@Mutation(() => StaffInfoUserComponents, { nullable: true })
	async userInfoIdStaff(@Arg('data', () => InputIdUser) data: InputIdUser) {

		type stripType = {
			props:{
				name:string
				email:string
				wallet:string
				document:string
				qDeposit:number
				allDeposit:number
				qWithdraw:number
				allWithdraw:number
				qCycle:number
				allCycle:number
			}
		}
		const 	userSend={
			name:'',
			email:'',
			wallet:'',
			document:'',
			qDeposit:'',
			allDeposit:'',
			qWithdraw:'',
			allWithdraw:'',
			qInvest:'',
			allInvest:'',
			qCompleteInvest:'',
			allCompleteInvest:'',
			qCycleProcess:'',
			allCycleProcess:'',
			qCycleActive:'',
			allCycleActive:'',
			qCycleComplete:'',
			allCycleComplete:'',
			qCycleCancel:'',
			cash:''
		} ;
		
		const validStateDocument = {INVALID:0,PROCESS:1,VALID:2};
		const currentToken = data.id;
		const userTryFind = await prisma.user.findUnique({where: { id: data.id }});
		if(!userTryFind){
			return null;
		}

		userSend.name = userTryFind.name ?? 'EMPTY';
		userSend.email = userTryFind.email;
		userSend.wallet = userTryFind.wallet ?? 'EMPTY';

		/* ------------------------------ work Document ----------------------------- */
		if(currentToken){
			const groupDoc = prisma.document.findMany({where: { userId: data.id }});
			if(!groupDoc){
				userSend.document = 'NOT_SEND';

			}else{

				let betterState = -1;
				for(const g of await groupDoc){
					if (g == null || g.state == null){
						continue;
					}
					if(validStateDocument[g.state] > betterState){
						betterState = validStateDocument[g.state];
					}
				}
				userSend.document = DocumentRole[betterState] == null ? 'EMPTY' : DocumentRole[betterState];
			}
		}else{
			return null;
		}
		userSend.cash = (await valueInCash(currentToken)).toString();

		const groupTransaction = await prisma.transaction.findMany({where: { userId: data.id }});
		const groupCycle= await prisma.cycle.findMany({where: { userId: data.id }});


		userSend.qDeposit = getTypeTransition(groupTransaction,'DEPOSIT').toString();
		userSend.allDeposit = getTypeTransition(groupTransaction,'DEPOSIT',false).toString();
		userSend.qWithdraw = getTypeTransition(groupTransaction,'WITHDRAW').toString();
		userSend.allWithdraw = getTypeTransition(groupTransaction,'WITHDRAW',false).toString();
		userSend.qInvest = getTypeTransition(groupTransaction,'INVEST').toString();
		userSend.allInvest = getTypeTransition(groupTransaction,'INVEST',false).toString();
		userSend.qCompleteInvest = getTypeTransition(groupTransaction,'COMPLETE_INVEST').toString();
		userSend.allCompleteInvest = getTypeTransition(groupTransaction,'COMPLETE_INVEST',false).toString();

		userSend.qCycleCancel = getTypeCycle(groupCycle,'CANCEl').toString();
		userSend.qCycleProcess = getTypeCycle(groupCycle,'PROCESS').toString();
		userSend.allCycleProcess = getTypeCycle(groupCycle,'PROCESS',false).toString();
		userSend.qCycleActive = getTypeCycle(groupCycle,'ACTIVE').toString();
		userSend.allCycleActive = getTypeCycle(groupCycle,'ACTIVE',false).toString();
		userSend.qCycleComplete = getTypeCycle(groupCycle,'COMPLETE').toString();
		userSend.allCycleComplete = getTypeCycle(groupCycle,'COMPLETE',false).toString();
		
		return userSend;
	}
}



const getTypeTransition = (
	arrayNow:[]|any,
	type:'DEPOSIT'|'WITHDRAW'|'INVEST'|'COMPLETE_INVEST',
	lent=true) =>{
	
	let cont =0;
	if(lent){
		arrayNow.reduce(function (previous:unknown, key:any) {
			if(!key.state){return previous;}
			if(key.state == 'COMPLETE'){
				if(key.action ==type){
					cont++;
				}
			}
			return previous;
		}, { value: 0 });

	}else{

		arrayNow.reduce(function (previous:unknown, key:any) {
			if(key.state === 'COMPLETE'){
				if(type==='DEPOSIT'){
					console.log('DEPOSIT',key);
					console.log('DEPOSIT',Number(key.value));
				}
				if(key.action ===type){
					cont+=Number(key.value);
				}
			}
			
			return previous;

		}, { value: 0 });
	}
	return cont;
	
};


const getTypeCycle = (
	arrayNow:[]|any,
	type:'PROCESS'|'CANCEl'|'ACTIVE'|'COMPLETE',
	lent=true) =>{
	let cont =0;
	if(lent){
		arrayNow.reduce(function (previous:unknown, key:any) {
			if(key.state == type){
				cont++;

			}
			return previous;
		}, { value: 0 });

	}else{
		
		arrayNow.reduce(function (previous:unknown, key:any) {
			if(key.state === type){
				cont+=Number(key.valueUSD);
			}
			return previous;
		}, { value: 0 });
	}
	return cont;
	
};