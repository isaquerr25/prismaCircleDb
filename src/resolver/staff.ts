import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, UserCash, UserHaveComponents, WalletAlter } from '../dto/user';
import { getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword } from '../utils';
import { validate } from 'bitcoin-address-validation';
import { profitCycle, profitFuture, valueInCash } from './utils';
import { isUserAuth } from '../middleware/isUserAuth';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { StaffActivity } from '../dto/staff';
import { addDays } from 'date-fns';
export const prisma = new PrismaClient();


enum DocumentRole {
	'INVALID',
	'PROCESS',
	'VALID',
}
@Resolver()
export class StaffResolver {

	GetValidateEmail(email: string) {
		return prisma.user.findFirst({ where: { email } });
	}

	@Mutation(() => [GraphState])
	async loginStaff(

		@Arg('data', () => LoginUser) data: LoginUser,
		@Ctx() ctx: any
	) {

		const businessRole = ['ADMIN','MANAGER','DEVELOPER','TESTER'];
		const newValidateUser: GraphState[] = [];

		const haveEmail = await this.GetValidateEmail(data.email);




		if (haveEmail) {

			if (!businessRole.includes(haveEmail.role.toString())) {

				newValidateUser.push({
					field: 'not Staff',
					message: 'email or password wrong',
				});
				return newValidateUser;
			}

			const coke = await validateLogin(
				haveEmail.password,
				data.password,
				haveEmail.id,
				haveEmail.role.toString()
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

	@UseMiddleware(isManagerAuth)
	@Query(() => StaffActivity,{nullable:true})
	async activeStartStaff() {
		const result:StaffActivity={};

		const allCycle = await prisma.cycle.findMany({where:{state:'PROCESS'}});
		const allWithdrawAll = await prisma.transaction.findMany({where:{state:'PROCESS',action:'WITHDRAW'}});
		const allDocumentsValidate = await prisma.document.findMany({where:{state:'PROCESS'}});

		const allValueEnterToday = await prisma.transaction.findMany({where:{
			state:'COMPLETE',
			action:'DEPOSIT',
			updatedAt:{gte:addDays(new Date(),-1),lte:addDays(new Date(),+1)},
		}});

		result.cyclesStart = allCycle.length ?? 0;
		result.withdrawAll = allWithdrawAll.length ?? 0;
		result.documentsValidate = allDocumentsValidate.length ?? 0;
		result.transactionPay = allValueEnterToday.length ?? 0;
		let soma = 0;
		for (const aloneValueEnterToday of allValueEnterToday){
			soma += Number(aloneValueEnterToday.value);
		}
		result.valueEnterToday = soma;
		return result ;
	}
}