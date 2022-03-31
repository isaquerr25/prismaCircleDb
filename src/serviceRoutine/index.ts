import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();


(function better(){
	//logic here
	setTimeout(better, 100);
})();



// consult if transaction finish


// consult if cycle invest finish
