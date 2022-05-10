import { addMonths } from 'date-fns';
import { daysInMonth } from './daysInMonth';

export const calculatorProfitPossibility = (beginDate: Date | null, finishDate: Date | null | undefined, valueUSD: number | null) => {

	beginDate?.setMinutes(beginDate.getMinutes( ) + beginDate.getTimezoneOffset() );
	finishDate?.setMinutes(finishDate.getMinutes( ) + finishDate.getTimezoneOffset() );
	
	if (beginDate == null || finishDate == null || finishDate == undefined || valueUSD == null) {
		return 0;
	} else {
		beginDate?.setMinutes(beginDate.getMinutes( ) + beginDate.getTimezoneOffset() );
		finishDate?.setMinutes(finishDate.getMinutes( ) + finishDate.getTimezoneOffset() );
		const beginDateLastDay = new Date(beginDate.getFullYear(), beginDate.getMonth() + 1, 0);
		beginDateLastDay?.setMinutes(beginDateLastDay.getMinutes( ) + beginDateLastDay.getTimezoneOffset() );
		
		let valuePrice = valueUSD;
		let startDate = new Date(beginDate.getFullYear(),beginDate.getMonth(),1);

		
		while (startDate <= finishDate) {
			

			const percenterProfit = 0.045;

			console.log('valuePrice  ',valuePrice );
			if (beginDate.getMonth() == finishDate.getMonth() && beginDate.getFullYear() == finishDate.getFullYear() &&
				startDate.getMonth() == beginDate.getMonth() && startDate.getFullYear() == beginDate.getFullYear()) {

				/* ---------------------- (10000+10000*450/100/100)/100 --------------------- */
				console.log('a');
				valuePrice += valuePrice *  Math.abs(finishDate.getDate() - beginDate.getDate()) * (percenterProfit / beginDateLastDay.getDate());

			
			}else if (startDate.getMonth() == finishDate.getMonth() && startDate.getFullYear() == finishDate.getFullYear()) {
				console.log('c');
				console.log('valuePrice  ',valuePrice );
				valuePrice += valuePrice * ( finishDate.getDate()  * (percenterProfit / (new Date(finishDate.getFullYear(),finishDate.getMonth()+1,0)).getDate()));
				console.log('valuePrice  ',valuePrice ,' finishDate  ',finishDate.getDate(),' percenterProfit  ',percenterProfit,' dayMoth  ',(new Date(finishDate.getFullYear(),finishDate.getMonth()+1,0)).getDate());
			
			}else if (startDate.getMonth() == beginDate.getMonth() && startDate.getFullYear() == beginDate.getFullYear()  ) {

				console.log('b');
				console.log(beginDate, beginDate.getDate() , beginDateLastDay.getDate()  , percenterProfit , beginDateLastDay.getDate());
				valuePrice +=  ( 
					valuePrice * Math.abs( beginDate.getDate() - (new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate())  *
					(percenterProfit / (new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate())
				);

			} else {
				console.log('d');
				valuePrice += valuePrice * percenterProfit;
			}
			startDate = addMonths(new Date(startDate), 1);
		}
		return valuePrice;
	}
};



export const calculatorProfit = (beginDate: Date | null, finishDate: Date | null | undefined, valueUSD: number | null,groupMoth:any|null) => {


	beginDate?.setMinutes(beginDate.getMinutes( ) + beginDate.getTimezoneOffset() );
	finishDate?.setMinutes(finishDate.getMinutes( ) + finishDate.getTimezoneOffset() );
	
	if (beginDate == null || finishDate == null || finishDate == undefined || valueUSD == null) {
		return 0;
	} else {
		
		let startDate = new Date(beginDate.getFullYear(),beginDate.getMonth(),1);
		const beginDateLastDay = new Date(beginDate.getFullYear(), beginDate.getMonth() + 1, 0);
		beginDateLastDay?.setMinutes(beginDateLastDay.getMinutes( ) + beginDateLastDay.getTimezoneOffset() );
		
		let valuePrice = valueUSD;

		console.log('beginDate ',beginDate.toISOString() ,beginDate.getDate(),(new Date(beginDate.toISOString())).getDate(), beginDateLastDay , beginDateLastDay.getDate());

		while (startDate <= finishDate) {

			const mo:string = startDate.getMonth().toString();
			const ye:string = startDate.getFullYear().toString();
			const go =  (mo+'-'+ye);

			const percenterProfit = (groupMoth[go] ? groupMoth[go] :  Number(process.env.PROFIT_STANDARD_MONTH))/100/100;



			if (beginDate.getMonth() == finishDate.getMonth() && beginDate.getFullYear() == finishDate.getFullYear() &&
				startDate.getMonth() == beginDate.getMonth() && startDate.getFullYear() == beginDate.getFullYear()) {

				/* ---------------------- (10000+10000*450/100/100)/100 --------------------- */
				console.log('a');
				valuePrice += valuePrice *  Math.abs(finishDate.getDate() - beginDate.getDate()) * (percenterProfit / beginDateLastDay.getDate());

			
			}else if (startDate.getMonth() == finishDate.getMonth() && startDate.getFullYear() == finishDate.getFullYear()) {
				console.log('c');
				console.log('valuePrice  ',valuePrice );
				valuePrice += valuePrice * ( finishDate.getDate()  * (percenterProfit / (new Date(finishDate.getFullYear(),finishDate.getMonth()+1,0)).getDate()));
				console.log('valuePrice  ',valuePrice ,' finishDate  ',finishDate.getDate(),' percenterProfit  ',percenterProfit,' dayMoth  ',(new Date(finishDate.getFullYear(),finishDate.getMonth()+1,0)).getDate());
			
			}else if (startDate.getMonth() == beginDate.getMonth() && startDate.getFullYear() == beginDate.getFullYear()  ) {

				console.log('b');
				console.log(beginDate, beginDate.getDate() , beginDateLastDay.getDate()  , percenterProfit , beginDateLastDay.getDate());
				valuePrice +=  ( 
					valuePrice * Math.abs( beginDate.getDate() - (new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate())  *
					(percenterProfit / (new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate())
				);

			} else {
				console.log('d');
				valuePrice += valuePrice * percenterProfit;
			}
			startDate = addMonths(new Date(startDate), 1);
		}
		return valuePrice;
	}
};





