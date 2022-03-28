import { ObjectType, Field, InputType, Int } from 'type-graphql';

@ObjectType()
export class UserAll {
	@Field(() => Int)
		id!: number;
	@Field(() => String)
		email!: string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Field((type) => String, { nullable: true })
		name?: string | null;
	@Field((type) => String, { nullable: true })
		wallet?: string | null;

}



@ObjectType()
export class UserHaveComponents {
	@Field(() => String)
		email!: string;
	@Field((type) => String, { nullable: true })
		name?: string | null;
	@Field((type) => String, { nullable: true })
		wallet?: string | null;
	@Field((type) => String, { nullable: true })
		document?: string;

}


@InputType()
export class CreateUser {
	@Field(() => String)
		email!: string;

	@Field(() => String)
		name!: string;

	@Field(() => String)
		password!: string;
}

@InputType()
export class LoginUser {
	@Field(() => String)
		email!: string;
	@Field(() => String)
		password!: string;
}

@InputType()
export class PasswordAlter {
	@Field(() => String)
		oldPassword!: string;
	@Field(() => String)
		password!: string;
}
@InputType()
export class WalletAlter {
	@Field(() => String)
		wallet!: string;
}