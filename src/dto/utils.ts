import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class GraphState {
	@Field(() => String, { nullable: true })
		field?: string;
	@Field(() => String, { nullable: true })
		message?: string;
}