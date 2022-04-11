import { ObjectType, Field, InputType, Int} from 'type-graphql';
import BigInt from 'graphql-bigint';

@ObjectType()
export class StaffActivity {
	@Field(() => Int)
		cyclesStart?: number;
	@Field(() => Int)
		withdrawAll?: number;
	@Field(() => Int)
		documentsValidate?: number;
	@Field(() => Int)
		transactionPay?: number;
	@Field(() => Int)
		valueEnterToday?: number;
}


@InputType()
export class InputIdUser {
	@Field(() => Int)
		id!: number;
}


@ObjectType()
export class StaffInfoUserComponents {
	@Field(() => String, { nullable: true })
		name?: string | null;
	@Field(() => String)
		email!: string;
	@Field(() => String, { nullable: true })
		wallet?: string | null;
	@Field(() => String, { nullable: true })
		document?: string;
	@Field(() => String, { nullable: true })
		qDeposit?: string| null;
	@Field(() => String, { nullable: true })
		allDeposit?: string| null;
	@Field(() => String, { nullable: true })
		qWithdraw?: string| null;
	@Field(() => String, { nullable: true })
		allWithdraw?: string| null;
	@Field(() => String, { nullable: true })
		qInvest?: string| null;
	@Field(() => String, { nullable: true })
		allInvest?: string| null;
	@Field(() => String, { nullable: true })
		qCompleteInvest?: string| null;
	@Field(() => String, { nullable: true })
		allCompleteInvest?: string| null;
	@Field(() => String, { nullable: true })
		qCycleProcess?: string| null;
	@Field(() => String, { nullable: true })
		allCycleProcess?: string| null;
	@Field(() => String, { nullable: true })
		qCycleActive?: string| null;
	@Field(() => String, { nullable: true })
		allCycleActive?: string| null;
	@Field(() => String, { nullable: true })
		qCycleComplete?: string| null;
	@Field(() => String, { nullable: true })
		allCycleComplete?: string| null;
	@Field(() => String, { nullable: true })
		cash?: string| null;
}