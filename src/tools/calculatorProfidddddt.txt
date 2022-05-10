import { addMonths } from 'date-fns';
import { daysInMonth } from './daysInMonth';

export const calculatorProfitPossibility = (beginDate: Date | null, finishDate: Date | null | undefined, valueUSD: number | null) => {

	if (beginDate == null || finishDate == null || finishDate == undefined || valueUSD == null) {

		return 0;

	} else {

		const percenterProfit = 0.04;

		let valuePrice = valueUSD;


		let startDate = beginDate;

		while (startDate <= finishDate) {

			const dayMoth = daysInMonth(startDate.getMonth(), startDate.getFullYear());

			if (startDate.getMonth() == finishDate.getMonth() && startDate.getFullYear() == finishDate.getFullYear() &&
				beginDate.getMonth() == finishDate.getMonth() && beginDate.getFullYear() == finishDate.getFullYear()) {

				valuePrice += valuePrice * (((dayMoth - beginDate.getDate()) + (finishDate.getDate() - dayMoth)) * (percenterProfit / dayMoth));

			}
			else if (startDate == beginDate) {

				valuePrice += valuePrice * (dayMoth - beginDate.getDate()) * (percenterProfit / dayMoth);

			}
			else if (startDate.getMonth() == finishDate.getMonth() && startDate.getFullYear() == finishDate.getFullYear()) {

				console.log('a');
				valuePrice += valuePrice * (dayMoth - finishDate.getDate()) * (percenterProfit / dayMoth);

			} else {

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
		
		const beginDateLastDay = new Date(beginDate.getFullYear(), beginDate.getMonth() + 1, 0);
		beginDateLastDay?.setMinutes(beginDateLastDay.getMinutes( ) + beginDateLastDay.getTimezoneOffset() );
		
		let valuePrice = valueUSD;
		let startDate = beginDate;

		console.log('beginDate ',beginDate.toISOString() ,beginDate.getDate(),(new Date(beginDate.toISOString())).getDate(), beginDateLastDay , beginDateLastDay.getDate());

		while (startDate <= finishDate) {

			const mo:string = startDate.getMonth().toString();
			const ye:string = startDate.getFullYear().toString();
			const go =  (mo+'-'+ye);

			const percenterProfit = (groupMoth[go] ? groupMoth[go] :  Number(process.env.PROFIT_STANDARD_MONTH))/100/100;
			console.log('percenterProfit ',percenterProfit, valuePrice);
			const dayMoth = daysInMonth(startDate.getMonth(), startDate.getFullYear());


			

			if (beginDate.getMonth() == finishDate.getMonth() && beginDate.getFullYear() == finishDate.getFullYear() &&
				startDate == beginDate ) {

				/* ---------------------- (10000+10000*450/100/100)/100 --------------------- */
				console.log('a');
				valuePrice += valuePrice *  Math.abs(finishDate.getDate() - beginDate.getDate()) * (percenterProfit / beginDateLastDay.getDate());

			}
			else if (startDate == beginDate) {

				console.log('b');
				console.log(beginDate, beginDate.getDate() , beginDateLastDay.getDate()  , percenterProfit , beginDateLastDay.getDate());
				valuePrice +=  ( valuePrice * Math.abs( beginDate.getDate() - beginDateLastDay.getDate() ) * (percenterProfit / beginDateLastDay.getDate()));

			}else if (startDate.getMonth() == finishDate.getMonth() && startDate.getFullYear() == finishDate.getFullYear()) {
				console.log('c');
				console.log('startDate  ',startDate.getMonth() ,finishDate.getMonth() ,startDate,finishDate);
				console.log('finishDate  ',(new Date(finishDate)).toString() ,new Date(finishDate).toISOString() ,(new Date(finishDate)).getDate());
				valuePrice += valuePrice * finishDate.getDate()  * (percenterProfit / dayMoth);
			} else {
				console.log('d');
				valuePrice += valuePrice * percenterProfit;
			}
			startDate = addMonths(new Date(startDate), 1);
		}
		return valuePrice;
	}
};
