import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, WalletAlter } from '../dto/user';
import { getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword } from '../utils';
import { validate } from 'bitcoin-address-validation';
export const prisma = new PrismaClient();

@Resolver()
export class UserResolver {
	@Query(() => [UserAll], { nullable: true })
	async allUsers() {
		return prisma.user.findMany();
	}

	@Query(() => UserAll, { nullable: true })
	async changePasswordUser() {
		return prisma.user.findMany();
	}

	@Mutation(() => [GraphState])
	async createUserResolver(@Arg('data', () => CreateUser) data: CreateUser) {
		console.log('await');
		console.log(await validateCreateUser(data));
		const stateReturn = await validateCreateUser(data);

		if (await prisma.user.findFirst({ where: { email: data.email } })) {
			stateReturn.push({
				field: 'error',
				message: 'this email already exists',
			});
			return stateReturn;
		}

		if (stateReturn.length == 0) {
			try {
				data.password = await HashGenerator(data.password);
				const createUser = await prisma.user.create({ data });
				console.log(createUser);
				stateReturn.push({
					field: 'create',
					message: 'success',
				});
			} catch {
				stateReturn.push({
					field: 'create',
					message: 'error',
				});
			}
		} else {
			stateReturn.push({
				field: 'create',
				message: 'contact the support',
			});
		}

		return stateReturn;
	}
	GetValidateEmail(email: string) {
		return prisma.user.findFirst({ where: { email } });
	}

	@Query(() => [GraphState])
	async LoginAuthUser(
		@Arg('data', () => LoginUser) data: LoginUser,
		@Ctx() ctx: any
	) {
		console.log('ctx');
		const newValidateUser: GraphState[] = [];

		const haveEmail = await this.GetValidateEmail(data.email);

		if (haveEmail) {
			const coke = await validateLogin(
				haveEmail.password,
				data.password,
				haveEmail.id
			);
			console.log('coke =============================>', coke);

			if (coke) {
				const { res } = ctx;

				res.cookie('access-token', coke);

				newValidateUser.push({
					field: 'success',
					message: 'login success',
				});
			} else {
				//password wrong
				newValidateUser.push({
					field: 'access',
					message: 'email or password wrong',
				});
			}
		} else {
			//email wrong
			newValidateUser.push({
				field: 'access',
				message: 'email or password wrong',
			});
		}

		return newValidateUser;
	}

	@Mutation(() => GraphState, { nullable: true })
	async updateAuthPassword(
		@Arg('data', () => PasswordAlter) data: PasswordAlter,
		@Ctx() ctx: any	)
	{
		let newValidateUser = {};

		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken },
		});
		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'password',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		if (validatePassword(data.oldPassword)) {
			console.log('asd');
			if (data.password == data.oldPassword) {
				newValidateUser = {
					field: 'password',
					message: 'The old password is same new password',
				};
				return newValidateUser;
			}
			if (currentToken != null) {
				console.log('await');
				if (await bcrypt.compare(data.oldPassword, newUser.password))
				{
					console.log('s');
					const newPassword= await HashGenerator(data.password);
					try {
						await prisma.user.update({
							where: { id: currentToken },
							data: { password: newPassword },
						});
						return { field: 'success', message: 'change password' };
					} catch (errors) {
						return { field: 'update', message: errors };
					}
				} else {
					return {
						field: 'password',
						message: 'The old password is not the same',
					};
				}
			} else {
				return { field: 'Server', message: 'Do not have access' };
			}
		} else {
			return {
				field: 'new password',
				message:
						'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
			};
		}
		return { field: 'old password', message: '404' };
	}

	@Mutation(() => GraphState, { nullable: true })
	async updateWallet(
		@Arg('data', () => WalletAlter) data: WalletAlter,
		@Ctx() ctx: any	)
	{
		let newValidateUser = {};
		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken },
		});
		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'account',
				message: 'Account not exist',
			};
			return newValidateUser;
		}

		const validWallet =validate(data.wallet);

		if (validWallet) {
			console.log('asd');
			if (currentToken != null) {
				console.log('await');
				try {

					await prisma.user.update({
						where: { id: currentToken },
						data: { wallet: data.wallet },
					});

					return { field: 'success', message: 'change wallet' };

				} catch (errors) {

					return { field: 'wallet', message: errors };
				}
			}
			else {
				return { field: 'Server', message: 'Do not have access' };
			}
		} else {
			return {
				field: 'wallet',
				message:'wallet invalid, try another wallet',
			};
		}
	}
}
