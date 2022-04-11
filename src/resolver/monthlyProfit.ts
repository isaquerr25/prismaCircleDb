import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { GraphState } from '../dto/utils';
import { InputDeleteMonthlyProfit, InputMonthlyProfit, InputUpdateMonthlyProfit, MonthlyProfitAll } from '../dto/monthlyProfit';
import { InputDeleteCycle } from '../dto/cycle';
import { isManagerAuth } from '../middleware/isManagerAuth';

export const prisma = new PrismaClient();


@Resolver()
export class MonthlyProfitResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [MonthlyProfitAll], { nullable: true })
	async allMonthlyProfit() {
		return prisma.monthlyProfit.findMany();
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(() => MonthlyProfitAll, { nullable: true })
	async idMonthlyProfit(@Arg('data', () => InputDeleteMonthlyProfit) data: InputDeleteMonthlyProfit) {
		return prisma.monthlyProfit.findFirst({where:{id:data.id}});
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async createMonthlyProfit(@Arg('data', () => InputMonthlyProfit) data: InputMonthlyProfit){
		const stateReturn = [];
		try {
			const createUser = await prisma.monthlyProfit.create({data});
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
		return stateReturn;
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async updateMonthlyProfit(@Arg('data', () => InputUpdateMonthlyProfit) data: InputUpdateMonthlyProfit){

		const stateReturn = [];

		if(data.id ==null){


			stateReturn.push({
				field: 'monthlyProfit',
				message: 'not exists',
			});

			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {

				const createUser = await prisma.monthlyProfit.update({where:{id:data.id}, data});
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


	@UseMiddleware(isManagerAuth)
	@Mutation(()=> [GraphState])
	async deleteMonthlyProfit(@Arg('data', () => InputDeleteCycle) data: InputDeleteCycle){

		const stateReturn = [];

		if(data.id ==null){

			stateReturn.push({
				field: 'monthlyProfit',
				message: 'not exists',
			});

			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {
				const createUser = await prisma.monthlyProfit.delete({where:{id:data.id}});
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
