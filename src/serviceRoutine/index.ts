import { PrismaClient } from '@prisma/client';
import { consultFinishTransaction } from './transaction';
import { consultFinishCycle } from './cycles';
export const prisma = new PrismaClient();




export default ()=>{

	(async function routines (){
	//logic here
		await consultFinishTransaction(prisma);
		await consultFinishCycle(prisma);
		setTimeout(routines, 1000*60*10);
	})();

};

// consult if cycle invest finish