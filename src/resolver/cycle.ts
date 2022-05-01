import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { getTokenId } from '../utils';
import { CycleAll, CycleAllUser, InputDeleteCycle, InputNewCycle, InputUpdateCycle } from '../dto/cycle';
import { PrismaClient } from '@prisma/client';
import convertUSD from '../payments/convert';
import { valueInCash } from './utils';
import { createHash } from './document';
import { isManagerAuth } from '../middleware/isManagerAuth';
import convert from '../payments/convert';
import clientPayments from '../payments/centerPayments';
import { createTransactionPayment } from '../payments/deposit';
import { RequestDeposit } from '../dto/transaction';
export const prisma = new PrismaClient();


@Resolver()
export class CycleResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [CycleAll], { nullable: true })
	async allCycle() {
		return prisma.cycle.findMany();
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => [CycleAllUser], { nullable: true })
	async allCycleUserAdminProcess() {
		return prisma.cycle.findMany({where:{state:'PROCESS'},include:{user:true}});
	}

	@Query(() => [CycleAll],{nullable:true})
	async allCycleByUser(@Ctx() ctx: any) {
		return prisma.cycle.findMany({where:{userId:getTokenId(ctx)?.userId}});
	}

	/* -------------------------------------------------------------------------- */
	/*                                 createCycle                                */
	/* -------------------------------------------------------------------------- */
	//ANCHOR createCycle 	
	@Mutation(()=> RequestDeposit)
	async createCycle(@Arg('data', () => InputNewCycle) data: InputNewCycle,@Ctx() ctx: any){
		console.log('cccc');
		/* ------------------------- verify if user is true ------------------------- */
		interface stateReturnType{
			url:string
			status:{field?:string,message?:any}[]
		}
	
		const stateReturn:stateReturnType = {
			'url':'',
			'status':[]
		};
	
		const idValid = getTokenId(ctx)?.userId;
		const userComplete = await prisma.user.findFirst({ where: { id: idValid }});
		if (!userComplete  || idValid == null) {
			stateReturn.status.push({
				field: 'error',
				message: 'this user not exists',
			});
		}
		
		/* --------------------- verify if have wrong parameter --------------------- */
		
		if(data.useMoney === true){
			console.log(await valueInCash(idValid,data.moneyUser));
			console.log(await valueInCash(idValid));
			if( await valueInCash(idValid,data.moneyUser) == -1 ){
				stateReturn.status.push({
					field: 'cash in account',
					message: 'value below necessary',
				});
				return stateReturn;
			}
		}


		if (stateReturn.status.length == 0) {
			try {
				if(data.useMoney === true && data.moneyUser!=undefined){

					if(data.moneyUser >=  data.valueUSD){

						/* --------- criaç~ao do cyclo apenas usando o dinheiro em com conta -------- */

						const resultDepositGenerate = data.days+'_'+idValid.toString()+createHash();
						const valueConvertBTC = (await convertUSD(data.valueUSD,true)).toString();
						const propTransaction = {
							action:'INVEST',
							value: data.valueUSD,
							valueBTC: valueConvertBTC,
							hash: resultDepositGenerate,
							wallet: 'internal' ,
							userId: idValid ,
							state:	'COMPLETE'
						};
						
						await prisma.transaction.create({data:propTransaction});

						await prisma.cycle.create({data:{
							action:'INVEST',
							valueUSD:data.valueUSD,
							valueBTC:valueConvertBTC,
							beginDate:null,
							finishDate:null,
							userId:idValid,
							hash:resultDepositGenerate
						}
						});
						stateReturn.status.push({
							field: 'create',
							message: 'success',
						});


					}else{

						/* ---------------------------- deposito parcial ---------------------------- */
						
						const calculateBTC = data.valueUSD - data.moneyUser;

						//vai utilizar um novo deposito
						const resultDepositGenerate = await createDeposit({
							idValid: idValid,
							value: calculateBTC,
							hash: '',
							days: data.days,
							user: userComplete
						});
						/* ------------------- decrementa da conta o valor parcial ------------------ */

						const propTransaction = {
							action:'INVEST',
							value: data.moneyUser,
							valueBTC: (await convertUSD(data.moneyUser,true)).toString(),
							hash: resultDepositGenerate.hash,
							wallet: 'internal' ,
							userId: idValid,
							state:	'COMPLETE'
						};

						//vai utilizar o dinheiro que ja estava na plataforma
						if(data.moneyUser > 0){

							await prisma.transaction.create({data:propTransaction});
						}
						
						stateReturn.url = resultDepositGenerate.url;
						
						stateReturn.status.push({
							field: 'create',
							message: 'success',
						});
						
					}

				}else{

					/* --------------- depositando usando apenas um novo deposito --------------- */

					const resultDepositGenerate = await createDeposit({
						idValid: idValid,
						value: data.valueUSD,
						hash: '',
						days: data.days,
						user: userComplete
					});
					stateReturn.url = resultDepositGenerate.url;

					stateReturn.status.push({
						field: 'create',
						message: 'success',
					});
				}
				

			} catch(error) {

				stateReturn.status.push({
					field: 'create',
					message: error,
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
	/*                                 updateCycle                                */
	/* -------------------------------------------------------------------------- */
	//ANCHOR updateCycle   
	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async updateCycle(@Arg('data', () => InputUpdateCycle) data: InputUpdateCycle,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;

		if (!await prisma.user.findFirst({ where: { id: idValid } })  || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
			return stateReturn;
		}

		if(data.id ==null){


			stateReturn.push({
				field: 'cycle',
				message: 'not exists',
			});
			return stateReturn;
		}
		if (stateReturn.length == 0) {
			try {

				const createCycle = await prisma.cycle.update({where:{id:data.id}, data});
				const cycleTemp = await prisma.cycle.findFirst({where:{id:data.id}});
				const transactionTemp = await prisma.transaction.findFirst({where:{hash:cycleTemp?.hash}});

				if(transactionTemp){

					if(data?.state =='CANCEL'){

						await prisma.transaction.findMany({where:{hash:transactionTemp?.hash} }).then( async (resultInter) => {
							for(const interFind in resultInter){
								await prisma.transaction.update({where:{id:resultInter[interFind].id},data:{state:'CANCEL'}});


								const resultDepositGenerate = 'cancelInvest_'+resultInter[interFind].userId.toString()+createHash();
								const propTransaction = {
									action:'DEPOSIT',
									value: resultInter[interFind].value,
									valueBTC: resultInter[interFind].valueBTC,
									hash: resultDepositGenerate,
									wallet: 'internal' ,
									userId: resultInter[interFind].userId,
									state:	'COMPLETE'
								};
								await prisma.transaction.create({data:propTransaction});
						
							}
						});

					}
				}
				console.log(createCycle);
				stateReturn.push({
					field: 'update',
					message: 'success',
				});

			} catch(error) {
				console.log(error);
				stateReturn.push({
					field: 'update',
					message: error,
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

	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async deleteCycle(@Arg('data', () => InputDeleteCycle) data: InputDeleteCycle, @Ctx() ctx: any)
	{

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
				field: 'cycle',
				message: 'not exists',
			});

			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {
				const createUser = await prisma.cycle.delete({where:{id:data.id}});
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

interface typeDate {
	
	idValid:number
	value:number
	hash:string
	days:string
	user:any
}
const createDeposit = async (data:typeDate) => {
	interface stateReturnType{
		url:string
		hash:string
		valueBTC:any
		status:{field?:string,message?:string}[]
	}

	const stateReturn:stateReturnType = {
		'url':'',
		'valueBTC':'',
		'hash':'',
		'status':[]
	};

	const valueBtcNow = await convert(data.value);
	const objDeposit = {
		currency1: 'BTC',
		currency2: 'BTC',
		amount: valueBtcNow,
		buyer_email: data.user.email
	};
	const objTransactionPayment =  await createTransactionPayment( clientPayments(),objDeposit);

	data.hash = data.days+'_'+objTransactionPayment.txn_id;
	const valueBTC = objTransactionPayment.amount;

	/* ----------------------------- cria transaç~ao ---------------------------- */
	await prisma.transaction.create({
		data:{
			action: 'DEPOSIT',
			value: data.value,
			valueBTC: valueBTC,
			hash: data.hash,
			wallet: data.user.wallet ?? '',
			userId: data.idValid								
		}
				
	})
		.then((result)=>console.log(result))
		.catch((error)=>console.log(' error ',error));


	stateReturn.valueBTC = valueBTC;
	stateReturn.url = objTransactionPayment.status_url;
	stateReturn.hash = data.hash;
	stateReturn.status.push({
		field: 'success',
		message: 'Click on the button to go to the payment screen' ,
	});
	return stateReturn;
};