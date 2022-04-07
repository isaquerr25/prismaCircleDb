import { ObjectType, Field, InputType, Int} from 'type-graphql';
import BigInt from 'graphql-bigint';
import { UserAll } from './user';

@ObjectType()
export class CycleAll {

	@Field(() => Int)
		id?: number;
	@Field(() => String)
		action?: string;
	@Field(() => Int)
		valueUSD?: number;
	@Field(() => String)
		valueBTC?: string;
	@Field(() => Int, { nullable: true })
		finalValueUSD?: number;
	@Field(() => String, { nullable: true })
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

@ObjectType()
export class CycleAllUser {

	@Field(() => Int)
		id?: number;
	@Field(() => String)
		action?: string;
	@Field(() => Int)
		valueUSD?: number;
	@Field(() => String)
		valueBTC?: string;
	@Field(() => Int, { nullable: true })
		finalValueUSD?: number;
	@Field(() => String, { nullable: true })
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
	@Field(() => UserAll)
		user?: UserAll;
	@Field(() => String, { nullable: true })
		hash?: string;
}

@InputType()
export class InputNewCycle {

	@Field(() => String, { nullable: true })
		action?: string;
	@Field(() => Int)
		valueUSD!: number;
	@Field(() => String, { nullable: true })
		valueBTC?: string;
	@Field(() => Date)
		beginDate!: Date;
	@Field(() => Date)
		finishDate!: Date;
	@Field(() => Int, { nullable: true })
		userId!: number;
	@Field(() => String, { nullable: true })
		hash!: string;
}


@InputType()
export class InputUpdateCycle {

	@Field(() => Int)
		id!: number;
	@Field(() => String, { nullable: true })
		action?: string;
	@Field(() => Int, { nullable: true })
		valueUSD?: number;
	@Field(() => String, { nullable: true })
		valueBTC?: string;
	@Field(() => String, { nullable: true })
		state?: string;
	@Field(() => Date, { nullable: true })
		beginDate?: Date;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
	@Field(() => String, { nullable: true })
		finalValueBTC?: string ;
	@Field(() => Int, { nullable: true })
		finalValueUSD?: number;
}

@InputType()
export class InputDeleteCycle {

	@Field(() => Int)
		id!: number;
}



// cloudNery;
