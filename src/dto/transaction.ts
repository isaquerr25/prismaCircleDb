import { ObjectType, Field, InputType, Int } from 'type-graphql';
import BigInt from 'graphql-bigint';
import { DepositState, GraphState } from './utils';
import { UserAll } from './user';
// enum TransactionActionTypes {
//   WITHDRAW
//   DEPOSIT
//   INVEST
//   COMPLETE_CYCLE
// }

// enum TransactionStateTypes {
//   CANCEL
//   PROCESS
//   COMPLETE
// }



@ObjectType()
export class TransactionAll {
	@Field(() => Int)
		id?: number;
	@Field(() => String)
		action!: string;
	@Field(() => BigInt)
		value!: BigInt;
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
		action!: 'WITHDRAW' | 'DEPOSIT' | 'INVEST';
	@Field(() => Int)
		value!: number;
	@Field(() => String, { nullable: true })
		valueBTC?: string | null;
	@Field(() => String, { nullable: true })
		hash?: string | null;
	@Field(() => String, { nullable: true })
		wallet!: string ;
	@Field(() => Int , { nullable: true })
		userId!: number ;

}

@InputType()
export class InputUpdateTransaction {

	@Field(() => Int)
		id!: number;
	@Field(() => String, { nullable: true })
		action?: 'WITHDRAW' | 'DEPOSIT' | 'INVEST';
	@Field(() => Int, { nullable: true })
		value?: number;
	@Field(() => String, { nullable: true })
		state?: 'CANCEL' | 'PROCESS' | 'COMPLETE_CYCLE';
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
@ObjectType()
export class RequestDeposit {

	@Field(() => String, { nullable: true })
		url!: string ;
	@Field(() => [DepositState] , { nullable: true })
		status!: [] | null ;
}


@InputType()
export class InputTypeTransaction {
	@Field(() => String)
		action!: 'WITHDRAW' | 'DEPOSIT' | 'INVEST';
	@Field(() => String, { nullable: true })
		state!: 'CANCEL' | 'PROCESS' | 'COMPLETE_CYCLE';
}

@ObjectType()
export class TransactionUser {

	@Field(() => Int)
		id?: number;
	@Field(() => String)
		action!: string;
	@Field(() => BigInt)
		value!: BigInt;
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
	@Field(() => UserAll)
		user?: UserAll;
}


@InputType()
export class InputValidateWithdrawTransaction {
	@Field(() => String)
		token!: string;
}