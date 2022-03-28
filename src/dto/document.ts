import { ObjectType, Field, InputType, Int} from 'type-graphql';
import {GraphQLUpload} from 'graphql-upload';

@ObjectType()
export class DocumentAll {
	@Field(() => Int)
		id?: number;
	@Field(() => String)
		state?: string;
	@Field(() => String)
		fileName?: string;
	@Field(() => Int)
		userId?: number;
	@Field(() => Date)
		createdAt?: Date;
	@Field(() => Date)
		updatedAt?: Date;
}
