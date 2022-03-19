import { ObjectType, Field, InputType, Int} from 'type-graphql';


@ObjectType()
export class MonthlyProfitAll {
	@Field(() => Int)
		id?: number;
	@Field(() => Date, { nullable: true })
		createdAt?: Date;
	@Field(() => Date, { nullable: true })
		updatedAt?: Date;
	@Field(() => Int, { nullable: true })
		profit?: number;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
}

@InputType()
export class InputMonthlyProfit {
	@Field(() => Int)
		profit!: number;
	@Field(() => Date)
		finishDate!: Date;
}

@InputType()
export class InputUpdateMonthlyProfit {

	@Field(() => Int)
		id!: number;
	@Field(() => Int, { nullable: true })
		profit?: number;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
}

@InputType()
export class InputDeleteMonthlyProfit {

	@Field(() => Int)
		id!: number;
}