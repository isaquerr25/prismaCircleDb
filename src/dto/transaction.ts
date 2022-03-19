import { ObjectType, Field, InputType, Int } from 'type-graphql';

@ObjectType()
export class TransactionAll {
	@Field(() => Int)
		id?: number;
	@Field(() => String)
		action!: string;
	@Field(() => Int)
		value!: number;
	@Field(() => String)
		state?: string;
	@Field(() => String, { nullable: true })
		hash?: string | null;
	@Field(() => Date, { nullable: true })
		createdAt?: Date;
	@Field(() => Date, { nullable: true })
		updatedAt?: Date;
	@Field(() => String, { nullable: true })
		wallet?: string | null;

	@Field(() => Int, { nullable: true })
		userId?: number | null;

	@Field(() => String, { nullable: true })
		user?: string | null;
}

@InputType()
export class InputNewTransaction {


	@Field(() => String)
		action!: string;
	@Field(() => Int)
		value!: number;
	@Field(() => String)
		state!: string;
	@Field(() => String, { nullable: true })
		hash?: string | null;
	@Field(() => String)
		wallet!: string ;
	@Field(() => Int , { nullable: true })
		userId!: number ;
}

@InputType()
export class InputUpdateTransaction {

	@Field(() => Int)
		id!: number;
	@Field(() => String, { nullable: true })
		action?: string;
	@Field(() => Int, { nullable: true })
		value?: number;
	@Field(() => String, { nullable: true })
		state?: string;
	@Field(() => String, { nullable: true })
		hash?: string;
	@Field(() => String, { nullable: true })
		wallet?: string;
}


@InputType()
export class InputDeleteTransaction {

	@Field(() => Int)
		id!: number;
}