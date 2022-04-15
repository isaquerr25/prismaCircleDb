import { GetTransaction,GetMultiTransaction } from '../payments/deposit';
import clientPayments from '../payments/centerPayments';
import { addDays } from 'date-fns';

export const consultFinishTransaction = async(prisma:any) => {

	const allIncompleteTransaction = await prisma.transaction.findMany({ where:{ state:'PROCESS', action:'DEPOSIT',NOT:[{hash: null},{wallet: 'internal'}]}} );
	const fakeTransaction = await prisma.transaction.findMany({ where:{ state:'WAIT_VALIDATION_EMAIL',createdAt:{lte:addDays(new Date(),-1)} }} );
	if(fakeTransaction.length > 0){
		for(const hashAlone of fakeTransaction){
			prisma.transaction.update({
				where:{id:hashAlone.id},
				data:{state:'PROCESS'}
			}).then((result: any)=>{console.log(result);})
				.catch((error: any)=>{console.log(error);});
		}
	}
	
	if(allIncompleteTransaction.length > 0){

		const TxMultiHash = [];

		for(const paceTransaction of await allIncompleteTransaction){
			TxMultiHash.push(paceTransaction.hash);
		}

		try{
			const arrayResult = await GetMultiTransaction( clientPayments(),TxMultiHash);


			for(const hashAlone of allIncompleteTransaction){

				if(arrayResult[hashAlone.hash].wallet == 'internal'){
					continue;
				}
				if(arrayResult[hashAlone.hash] != null){

					if(arrayResult[hashAlone.hash].status !=0){

						prisma.transaction.update({
							where:{id:hashAlone.id},
							data:{state:arrayResult[hashAlone.hash].status == 1 ? 'COMPLETE' : 'CANCEL'}

						}).then((result: any)=>{console.log(result);})

							.catch((error: any)=>{console.log(error);});
					}
				}
			}
		}
		catch(error){
			console.log(error);
		}
	}
	return null;
};
