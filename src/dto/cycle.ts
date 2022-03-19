import { ObjectType, Field, InputType, Int} from 'type-graphql';
import BigInt from 'graphql-bigint';

@ObjectType()
export class CycleAll {

	@Field(() => Int)
		id?: number;
	@Field(() => String)
		action?: string;
	@Field(() => Int)
		valueUSD?: number;
	@Field(() => BigInt)
		valueBTC?: BigInt;
	@Field(() => Int, { nullable: true })
		finalValueUSD?: number;
	@Field(() => BigInt, { nullable: true })
		finalValueBTC?: BigInt;
	@Field(() => String)
		state?: string;
	@Field(() => Date)
		beginDate?: Date;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
	@Field(() => Date, { nullable: true })
		createdAt?: Date;
	@Field(() => Date, { nullable: true })
		updatedAt?: Date;
	@Field(() => Int, { nullable: true })
		userId?: number;

}

@InputType()
export class InputNewCycle {

	@Field(() => String)
		action!: string;
	@Field(() => Int)
		valueUSD!: number;
	@Field(() => String )
		valueBTCbig!: string;
	@Field(() => String)
		state!: string;
	@Field(() => Date)
		beginDate!: Date;
	@Field(() => Date)
		finishDate!: Date;
	@Field(() => Int, { nullable: true })
		userId!: number;
}


@InputType()
export class InputUpdateCycle {

	@Field(() => Int)
		id!: number;
	@Field(() => String, { nullable: true })
		action?: string;
	@Field(() => Int, { nullable: true })
		valueUSD?: number;
	@Field(() => Int, { nullable: true })
		valueBTC?: number;
	@Field(() => String, { nullable: true })
		state?: string;
	@Field(() => Date, { nullable: true })
		beginDate?: Date;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
	@Field(() => String, { nullable: true })
		finalValueBTCbig?: string ;
	@Field(() => Int, { nullable: true })
		finalValueUSD?: number;
	finalValueBTC?: bigint;
}

@InputType()
export class InputDeleteCycle {

	@Field(() => Int)
		id!: number;
}