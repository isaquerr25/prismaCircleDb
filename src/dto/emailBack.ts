import { ObjectType, Field, InputType, Int} from 'type-graphql';
import BigInt from 'graphql-bigint';
import { UserAll } from './user';

@ObjectType()
export class EmailAll {

	@Field(() => Int)
		id?: number;
	@Field(() => String)
		name?: string;
	@Field(() => String)
		email?: string;
	@Field(() => String)
		message?: string;
	@Field(() => Date, { nullable: true })
		createdAt?: Date;
}

@InputType()
export class InputEmailBack {

	@Field(() => String)
		name!: string;
	@Field(() => String)
		email!: string;
	@Field(() => String)
		message!: string;
}


@InputType()
export class InputUpdateEmailBack {
	@Field(() => Int)
		id!: number;
	@Field(() => String,{nullable:true})
		name?: string|null;
	@Field(() => String,{nullable:true})
		email?: string|null;
	@Field(() => String,{nullable:true})
		message?: string |null;

}

@InputType()
export class InputDeleteEmailBack {

	@Field(() => Int)
		id!: number;

}
