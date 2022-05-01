import { PrismaClient } from '@prisma/client';
import { calculatorProfitPossibility } from '../tools/calculatorProfit';

export const prisma = new PrismaClient();

export const valueInCash = async (userId:number,moneyUser:number|null = null) =>{
	const allUserTransition = await prisma.transaction.findMany({where:{userId:userId}});
	let somaAllTransaction = 0;

	for(const transFor of (allUserTransition)){

		if(transFor.state == 'CANCEL'){
			continue;
		}

		if(transFor.action == 'WITHDRAW' || transFor.action == 'INVEST'){
			somaAllTransaction -= Number(transFor.value);

		}else if((transFor.action == 'DEPOSIT' || transFor.action == 'COMPLETE_CYCLE') && transFor.state == 'COMPLETE'){
			somaAllTransaction += Number(transFor.value);
		}
	}
	if(moneyUser !==null){
		
		return somaAllTransaction >= moneyUser ? 1 : -1;
	}
	return somaAllTransaction;
};

export const profitCycle = async (userId:number) =>{
	const userCycle = await prisma.cycle.findMany({where:{userId:userId}});
	let somaAllTransaction = 0;

	for(const transFor of userCycle){

		if(transFor.state == 'COMPLETE'){
			somaAllTransaction += Number(transFor.finalValueUSD);
		}

	}
	return somaAllTransaction;
};

export const profitFuture = async (userId:number) =>{

	const userCycle = await prisma.cycle.findMany({where:{userId:userId}});
	let somaAllTransaction = 0;

	for(const transFor of ( userCycle)){

		if(transFor.state == 'ACTIVE'){

			somaAllTransaction += calculatorProfitPossibility(transFor.beginDate,transFor.finishDate,transFor.valueUSD);
		}
	}

	return somaAllTransaction;
};
