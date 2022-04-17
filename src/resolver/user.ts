import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, UserCash, UserHaveComponents, WalletAlter, NumberTelephoneAlter, ForgetPasswordAlter, ForgetPasswordNewAlter } from '../dto/user';
import { decodeTokenType, getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword, validationNumberPhone } from '../utils';
import { validate } from 'bitcoin-address-validation';
import { profitCycle, profitFuture, valueInCash } from './utils';
import { isUserAuth } from '../middleware/isUserAuth';
import { isManagerAuth } from '../middleware/isManagerAuth';
import emailValidSend, { emailForgetPasswordSend } from '../systemEmail';
import { number } from 'yup';
export const prisma = new PrismaClient();


enum DocumentRole {
	'INVALID',
	'PROCESS',
	'VALID',
}
@Resolver()
export class UserResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [UserAll], { nullable: true })
	async allUsers() {
		return prisma.user.findMany();
	}

	@UseMiddleware(isUserAuth)
	@Query(() => UserHaveComponents, { nullable: true })
	async userInfoDocument(@Ctx() ctx: any) {


		const validStateDocument: {
    INVALID: number;
    PROCESS: number;
    VALID: number;
		} = {INVALID:0,PROCESS:1,VALID:2};

		const currentToken = getTokenId(ctx)?.userId;
		console.log(getTokenId(ctx));
		if(currentToken){
			const groupDoc = prisma.document.findMany({where: { userId: currentToken }});
			if(!groupDoc){

				return prisma.user.findFirst({where: { id: currentToken }});
			}
			let betterState = -1;
			for(const g of await groupDoc){
				if (g == null || g.state == null){
					continue;
				}
				if(validStateDocument[g.state] > betterState){
					betterState = validStateDocument[g.state];
				}
			}
			const userF = await prisma.user.findFirst({where: { id: currentToken }});
			if(!userF){
				return null;
			}

			const document = DocumentRole[betterState] == null ? 'EMPTY' : DocumentRole[betterState];
			return {...userF,document:document,valuePrice:(await valueInCash(currentToken))};

		}else{
			return null;
		}

	}

	@Mutation(() => [GraphState])
	async createUserResolver(@Arg('data', () => CreateUser) data: CreateUser) {

		const stateReturn = await validateCreateUser(data);

		if(data.numberTelephone == null){
			stateReturn.push({
				field: 'error',
				message: 'Number Telephone is Null',
			});

			return stateReturn;

		}

		const numberValid = validationNumberPhone(data.numberTelephone!);

		if (!numberValid){
			stateReturn.push({
				field: 'number',
				message: 'Number Telephone not Valid',
			});

			return stateReturn;
		}

		if (await prisma.user.findFirst({ where: { numberTelephone: data.numberTelephone } })) {
			
			stateReturn.push({
				field: 'error',
				message: 'Number Telephone already exists',
			});
			
			return stateReturn;

		}
			
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
				emailValidSend(createUser);
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

	@Mutation(() => [GraphState])
	async loginAuthUser(
		@Arg('data', () => LoginUser) data: LoginUser,
		@Ctx() ctx: any
	) {
		console.log('ctx');
		const newValidateUser: GraphState[] = [];


		const haveEmail = await this.GetValidateEmail(data.email);
		
		if (haveEmail) {
			if(haveEmail?.confirm != 'valid'){
				emailValidSend(haveEmail);
				newValidateUser.push({
					field: 'access',
					message: 'email sent to confirm an account',
				});
			
				return newValidateUser;
			}
			const coke = await validateLogin(
				haveEmail.password,
				data.password,
				haveEmail.id,
				haveEmail.role
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

	@UseMiddleware(isUserAuth)
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

	@UseMiddleware(isUserAuth)
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

	@UseMiddleware(isUserAuth)
	@Mutation(() => GraphState, { nullable: true })
	async updateNumberTelephone(

		@Arg('data', () => NumberTelephoneAlter) data: NumberTelephoneAlter,
		@Ctx() ctx: any	)
	{
		let newValidateUser = {};

		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken},
		});

		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'account',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		const validNumberTelephone =validationNumberPhone(data.numberTelephone);

		if (validNumberTelephone) {
			console.log('asd');
			if (currentToken != null) {
				console.log('await');
				try {

					await prisma.user.update({
						where: { id: currentToken },
						data: { numberTelephone: data.numberTelephone },
					});

					return { field: 'success', message: 'change Number' };

				} catch (errors) {

					return { field: 'Number', message: errors };
				}
			}
			else {
				return { field: 'Server', message: 'Do not have access' };
			}
		} else {
			return {
				field: 'Number',
				message:'Number invalid, try another Number',
			};
		}
	}

	@Mutation(()=>Boolean,{nullable:true})
	async logout(@Ctx() ctx: any) {
		const { res } = ctx;
		res.clearCookie('access-token');
		return null;
	}

	@UseMiddleware(isUserAuth)
	@Query(() => UserCash, { nullable: true })
	async userAllMoney(@Ctx() ctx: unknown) {


		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken },
		});
		if (!currentToken || !newUser){
			return null;
		}
		try{
			return {balance:(await valueInCash(currentToken)),profitCycle: await profitCycle(currentToken),
				profitFuture:(await profitFuture(currentToken))};

		}catch{
			return null;
		}

	}


	@Mutation(() => GraphState, { nullable: true })
	async resolverForgetPassword(

		@Arg('data', () => ForgetPasswordAlter) data: ForgetPasswordAlter)
	{
		let newValidateUser = {};
		const newUser = await prisma.user.findFirst({
			where: { email: data.email},
		});
		
		if(newUser==null){
			newValidateUser = {
				field: 'account',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		const emailSendBack = await emailForgetPasswordSend(newUser);
		if(emailSendBack == 'success'){
			newValidateUser = {
				field: 'success',
				message: 'Email Send',
			};
			return newValidateUser;
		}

		newValidateUser = {
			field: 'Error',
			message: 'Try later',
		};

		return newValidateUser;
	}

	@Mutation(() => GraphState, { nullable: true })
	async newPassword(@Arg('data', () => ForgetPasswordNewAlter) data: ForgetPasswordNewAlter)
	{
		let newValidateUser = {};

		const currentToken = decodeTokenType(data.token).userId;
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
	}
}
