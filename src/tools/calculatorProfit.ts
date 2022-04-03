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



	if (beginDate == null || finishDate == null || finishDate == undefined || valueUSD == null) {
		return 0;
	} else {

		let valuePrice = valueUSD;
		let startDate = beginDate;

		while (startDate <= finishDate) {

			const mo:string = startDate.getMonth().toString();
			const ye:string = startDate.getFullYear().toString();
			const go =  (mo+'-'+ye);

			const percenterProfit = (groupMoth[go] ?? 400)/100/100;
			console.log('percenterProfit ',percenterProfit, valuePrice);
			const dayMoth = daysInMonth(startDate.getMonth(), startDate.getFullYear());


			if (startDate.getMonth() == finishDate.getMonth() && startDate.getFullYear() == finishDate.getFullYear() &&
				beginDate.getMonth() == finishDate.getMonth() && beginDate.getFullYear() == finishDate.getFullYear()) {

				/* ---------------------- (10000+10000*450/100/100)/100 --------------------- */
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
