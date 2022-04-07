import { GetTransaction,GetMultiTransaction } from '../payments/deposit';
import clientPayments from '../payments/centerPayments';

export const consultFinishTransaction = async(prisma:any) => {

	const allIncompleteTransaction = await prisma.transaction.findMany({ where:{ state:'PROCESS', action:'DEPOSIT',NOT:[{hash: null},{wallet: 'internal'}]}} );
	if(allIncompleteTransaction.length > 0){

		const TxMultiHash = [];

		for(const paceTransaction of await allIncompleteTransaction){
			TxMultiHash.push(paceTransaction.hash);
		}

		try{
			console.log(TxMultiHash);
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
