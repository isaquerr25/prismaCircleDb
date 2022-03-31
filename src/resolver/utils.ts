import { PrismaClient } from '@prisma/client';


export const prisma = new PrismaClient();

export const valueInCash = async (userId:number) =>{
	const allUserTransition = prisma.transaction.findMany({where:{userId:userId}});let somaAllTransaction = 0;

	for(const transFor of (await allUserTransition)){
		if(transFor.state == 'CANCEL'){
			continue;
		}
		if(transFor.action == 'WITHDRAW' || transFor.action == 'INVEST'){
			somaAllTransaction -= Number(transFor.value);

		}else if((transFor.action == 'DEPOSIT' || transFor.action == 'COMPLETE_CYCLE') && transFor.state == 'COMPLETE'){
			somaAllTransaction += Number(transFor.value);
		}
	}
	return somaAllTransaction;
};