import { GetTransaction,GetMultiTransaction } from '../payments/deposit';
import clientPayments from '../payments/centerPayments';
import { addDays } from 'date-fns';
import console from 'console';

export const consultFinishTransaction = async(prisma:any) => {
	console.log('consultFinishTransaction');
	const allIncompleteTransaction = await prisma.transaction.findMany({ where:{ state:'PROCESS', action:'DEPOSIT',NOT:[{hash: null}]}} );
	try{
		const fakeTransaction = await prisma.transaction.findMany({ where:{ state:'WAIT_VALIDATION_EMAIL',createdAt:{lte:addDays(new Date(),-1)} }} );
		if(fakeTransaction.length > 0){
			for(const objTransactions of fakeTransaction){
				prisma.transaction.update({
					where:{id:objTransactions.id},
					data:{state:'PROCESS'}
				}).then((result: any)=>{console.log(result);})
					.catch((error: any)=>{console.log(error);});
			
			}
		}
	}catch(error){
		console.log('error  ', error);
	}
	console.log('entrosss');
	if(allIncompleteTransaction.length > 0){

		const TxMultiHash = [];

		for(const paceTransaction of await allIncompleteTransaction){
			console.log('aaayy ',paceTransaction.hash.split('_')[1] );

			TxMultiHash.push(paceTransaction.hash.split('_')[1]);
		}

		try{
			console.log('cccccwww55555');
			const arrayPayments = await GetMultiTransaction( clientPayments(),TxMultiHash);



			for(const objTransaction of allIncompleteTransaction){

				let objSplitHash = '';
				if( (objTransaction.hash).includes('cycle30') || (objTransaction.hash).includes('cycle60') || (objTransaction.hash).includes('cycle120') ){

					const dateCycle = objTransaction.hash.split('_');
					objSplitHash = dateCycle[1];

				}
				if(objTransaction.wallet == 'internal'){

					continue;
					console.log('ssssccccss');
				}
				if(arrayPayments[objSplitHash] != null){

					if(arrayPayments[objSplitHash].status !=0 ){

						
						await prisma.transaction.update({
							where:{id:objTransaction.id},
							data:{
								state:arrayPayments[objSplitHash].status == 1 ? 'COMPLETE' : 'CANCEL',
								action:arrayPayments[objSplitHash].status == 1 ? 'INVEST' : 'DEPOSIT',
							}
	
						}).then((result: any)=>{console.log(result);});
						
						if (arrayPayments[objSplitHash].status == 1){

							const cycleTurn ={
								action:'INVEST',
								valueUSD:Number(objTransaction.value),
								valueBTC:objTransaction.valueBTC,
								userId:objTransaction.userId,
								hash:objTransaction.hash
							};
							await prisma.cycle.create({data:cycleTurn})
								.then((result: any)=>{console.log(result);})
								.catch((error: any)=>{console.log(error);});
						}
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
