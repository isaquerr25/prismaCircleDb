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