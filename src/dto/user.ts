import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class UserAll {
	@Field(() => String)
		email!: string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Field((type) => String, { nullable: true })
		name?: string | null;
	@Field((type) => String, { nullable: true })
		password?: string | null;
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