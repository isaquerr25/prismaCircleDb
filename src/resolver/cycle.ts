import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { GraphState } from '../dto/utils';

import { getTokenId } from '../utils';
import { CycleAll, InputDeleteCycle, InputNewCycle, InputUpdateCycle } from '../dto/cycle';
import { PrismaClient } from '@prisma/client';
import convertUSD from '../payments/convert';
import { addDays, addMonths } from 'date-fns';
import { valueInCash } from './utils';
import { createHash } from './document';

export const prisma = new PrismaClient();


@Resolver()
export class CycleResolver {
	@Query(() => [CycleAll], { nullable: true })
	async allCycle() {
		return prisma.cycle.findMany();
	}
	@Query(() => [CycleAll],{nullable:true})
	async allCycleByUser(@Ctx() ctx: any) {
		return prisma.cycle.findMany({where:{userId:getTokenId(ctx)?.userId}});
	}

	/* -------------------------------------------------------------------------- */
	/*                                 createCycle                                */
	/* -------------------------------------------------------------------------- */
	@Mutation(()=> [GraphState])
	async createCycle(@Arg('data', () => InputNewCycle) data: InputNewCycle,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;
		data.action ='invest';

		if (!await prisma.user.findFirst({ where: { id: idValid } })  || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
		}
		if( data.beginDate == null ){
			stateReturn.push({
				field: 'beginDate',
				message: 'null',
			});
			return stateReturn;
		}
		data.valueBTC = (await convertUSD(data.valueUSD,true)).toString();

		/* --------------------- verify if have wrong parameter --------------------- */
		const inCash = await valueInCash(idValid);
		console.log(inCash);

		if(data.valueUSD > inCash ||
			data.valueUSD < 5000 ||
			data.finishDate == null ||
			data.beginDate < new Date() ||
			data.finishDate < addDays(new Date(data.beginDate),+15) ||
			data.finishDate > addMonths(new Date(data.beginDate),+13)
		)
		{

			if (data.valueUSD < 5000 || data.valueUSD > inCash) {
				stateReturn.push({
					field: 'valueUSD',
					message: 'value below necessary',
				});
			}

			if (data.finishDate == null) {
				stateReturn.push({
					field: 'finishDate',
					message: 'null',
				});
			}
			if (data.beginDate < new Date() ) {
				stateReturn.push({
					field: 'Date',
					message: 'Date must start at least today',
				});
			}
			if (data.finishDate <  addDays(new Date(data.beginDate),+15)) {
				stateReturn.push({
					field: 'beginDate finishDate',
					message: 'Start and end dates need a difference of at least 15 days',
				});
			}
			if (data.finishDate > addMonths(new Date(data.beginDate),+13)) {
				stateReturn.push({
					field: 'finishDate',
					message: 'We do not accept cycles longer than 1 year',
				});
			}
		}


		if (stateReturn.length == 0) {
			try {
				const hashGenerated = 'cycle_'+idValid.toString()+createHash;
				const propTransaction = {
					action:'INVEST',
					value: data.valueUSD,
					valueBTC: data.valueBTC,
					hash: hashGenerated,
					wallet: 'internal' ,
					userId: idValid ,
				};

				await prisma.transaction.create({data:propTransaction});

				const createUser = await prisma.cycle.create({data:{
					action:data.action,
					valueUSD:data.valueUSD,
					valueBTC:data.valueBTC,
					beginDate:data.beginDate,
					finishDate:data.finishDate,
					userId:idValid,
					hash:hashGenerated
				}
				});

				console.log(createUser);
				stateReturn.push({
					field: 'create',
					message: 'success',
				});

			} catch(error) {

				stateReturn.push({
					field: 'create',
					message: error,
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
	/*                                 updateCycle                                */
	/* -------------------------------------------------------------------------- */
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

				const createUser = await prisma.cycle.update({where:{id:data.id}, data});
				console.log(createUser);
				stateReturn.push({
					field: 'update',
					message: 'success',
				});

			} catch(error) {
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