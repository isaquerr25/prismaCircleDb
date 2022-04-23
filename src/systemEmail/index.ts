import _ from 'lodash';
import nodemailer from 'nodemailer';
import { createAuthToken, createWithdrawToken } from '../utils';
import { UserAll } from '../dto/user';
import sgMail from '@sendgrid/mail';

const  emailValidSend = async(user:any) =>{

	const token = createAuthToken(user.id,user.role);
	const url = `https://www.tempestinvest.com/confirmation/${token}`;
	sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
	const msg = {
		to: user.email, // Change to your recipient
		from: process.env.SENDGRID_API_EMAIL!, // Change to your verified sender
		subject: 'Confirm Email',
		text: 'Confirm',
		html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
	};
	sgMail
		.send(msg)
		.then((result) => console.log('result ',result))
		.catch((error) => {
			console.error(error);
		});
};

export const  emailForgetPasswordSend = async(user:any) =>{

	const token = createAuthToken(user.id,user.role);
	const url = `https://www.tempestinvest.com/newPassword/${token}`;
	sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

	const msg = {
		to: user.email, // Change to your recipient
		from: process.env.SENDGRID_API_EMAIL!, // Change to your verified sender
		subject: 'Confirm Email',
		text: 'Confirm',
		html: `Please click this link to alter your password: <a href="${url}">${url}</a>`,
	};
	return sgMail
		.send(msg)
		.then((result) => {console.log('result ',result);return('success');})
		.catch((error) => {console.log('result ',error);return(error);});
	
};

export const  emailWithdrawConfirmSend = async(transaction:any,email:string,wallet:string) =>{

	const token = createWithdrawToken(transaction.id,transaction.userId);
	const url = `https://www.tempestinvest.com/user/withdraw/valid/${token}`;
	console.log(process.env.SENDGRID_API_KEY!);
	sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

	const msg = {
		to: email, // Change to your recipient
		from: process.env.SENDGRID_API_EMAIL!, // Change to your verified sender
		subject: 'Confirm Withdraw',
		text: 'Confirm',
		html: `Click the link to confirm if all correct.<br>
		This you Wallet: ${wallet}
		If not confirmed it will be canceled and returned to your account within 24-48hr.<br>
		But if it is not yours, we recommend changing the password for your greater security.<br>
		<a href="${url}">${url}</a>`,
	};
	return sgMail
		.send(msg)
		.then((result) => {console.log('result ',result);return('success');})
		.catch((error) => {console.log('result ',error);return(error);});
	
};


export default emailValidSend;
