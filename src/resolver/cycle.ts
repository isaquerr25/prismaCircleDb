import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { GraphState } from '../dto/utils';

import { getTokenId } from '../utils';
import { CycleAll, InputDeleteCycle, InputNewCycle, InputUpdateCycle } from '../dto/cycle';
import { PrismaClient } from '@prisma/client';


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

	@Mutation(()=> [GraphState])
	async createCycle(@Arg('data', () => InputNewCycle) data: InputNewCycle,@Ctx() ctx: any){

		const stateReturn = [];
		const idValid = getTokenId(ctx)?.userId;


		if (!await prisma.user.findFirst({ where: { id: idValid } })  || idValid == null) {
			stateReturn.push({
				field: 'error',
				message: 'this user not exists',
			});
		}
		if(data.valueBTCbig.match(/[0-9]{16,}/) != null){
			stateReturn.push({
				field: 'valueBTC',
				message: 'the value is too big',
			});
		}
		if( data.beginDate == null ){
			stateReturn.push({
				field: 'beginDate',
				message: 'null',
			});
			return stateReturn;
		}

		const futureDate = new Date(data.beginDate);
		futureDate.setDate(data.beginDate.getDate()+15);

		if(data.action =='' || data.valueUSD ==0 || data.state =='' ||
			data.finishDate == null ||	futureDate >=  data.finishDate )
		{

			if (data.valueUSD == 0 ) {
				stateReturn.push({
					field: 'valueUSD',
					message: 'value below necessary',
				});
			}

			if (data.state == '') {
				stateReturn.push({
					field: 'state',
					message: 'null',
				});
			}
			if (data.action =='') {
				stateReturn.push({
					field: 'action',
					message: 'null',
				});
			}
			if (data.finishDate == null) {
				stateReturn.push({
					field: 'finishDate',
					message: 'null',
				});
			}
			if (futureDate >=  data.finishDate) {
				stateReturn.push({
					field: 'beginDate finishDate',
					message: 'Start and end dates need a difference of at least 15 days',
				});
			}
		}

		if (stateReturn.length == 0) {
			try {

				const createUser = await prisma.cycle.create({data:{
					action:data.action,
					valueUSD:data.valueUSD,
					valueBTC:BigInt(data.valueBTCbig),
					state:data.state,
					beginDate:data.beginDate,
					finishDate:data.finishDate,
					userId:idValid,

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
		if(data.finalValueBTCbig){
			if(data.finalValueBTCbig.match(/[0-9]{16,}/) != null){
				stateReturn.push({
					field: 'valueBTC',
					message: 'the value is too big',
				});
			}else{
				data.finalValueBTC = BigInt(data.finalValueBTCbig);
				delete data.finalValueBTCbig;
			}
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