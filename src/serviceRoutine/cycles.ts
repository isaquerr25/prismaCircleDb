import { GetTransaction,GetMultiTransaction } from '../payments/deposit';
import clientPayments from '../payments/centerPayments';
import { addMonths } from 'date-fns';
import { calculatorProfit } from '../tools/calculatorProfit';
import convert from '../payments/convert';

export const consultFinishCycle = async(prisma:any) => {

	const allActiveCycles = await prisma.cycle.findMany({ where:{ state:'ACTIVE',finishDate:{lte: new Date()}} });


	if(allActiveCycles == null){
		return null;
	}
	console.log(allActiveCycles);
	const groupProfitMoth:any={'00-00':0};

	const allMothPrice    = await prisma.monthlyProfit.findMany({ where:{ finishDate:{
		gte: addMonths(new Date(),-(12*3)),
		lt:  addMonths(new Date(),+(12*3)),
	}}} );

	for(const mothPriceAlone of allMothPrice){
		if(mothPriceAlone.profit != null){

			const mo:string = mothPriceAlone.finishDate.getMonth().toString();
			const ye:string = mothPriceAlone.finishDate.getFullYear().toString();
			const go =  (mo+'-'+ye);
			groupProfitMoth[go] = mothPriceAlone.profit;
		}
	}
	console.log(groupProfitMoth);
	for(const cycleAlone of allActiveCycles){

		if(cycleAlone.finishDate <= new Date()){
			const profitFinal:number =  calculatorProfit(cycleAlone.beginDate,cycleAlone.finishDate,cycleAlone.valueUSD,groupProfitMoth);
			const valueBtcNow:string = (await convert(profitFinal)).toString();
			if(profitFinal == null || profitFinal==undefined){
				return null;
			}
			console.log(profitFinal,valueBtcNow);
			prisma.cycle.update({
				where:{id:cycleAlone.id},
				data:{state:'COMPLETE',finalValueUSD:Math.round(profitFinal),finalValueBTC:valueBtcNow}

			}).then( async(result: unknown)=>{
				await prisma.transaction.create({data:{
					action:'COMPLETE_CYCLE',
					value:Math.round(profitFinal),
					valueBTC:'-',
					state:'COMPLETE',
					wallet:'internal',
					userId:cycleAlone.userId,
					hash:cycleAlone.hash?? cycleAlone.userId.toString()
				}});
			})

				.catch((error: any)=>{console.log(error);});
		}
	}
	return null;
};
