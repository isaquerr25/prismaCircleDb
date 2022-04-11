import _ from 'lodash';
import nodemailer from 'nodemailer';
import { createAuthToken } from '../utils';
import { UserAll } from '../dto/user';
import sgMail from '@sendgrid/mail';

const  emailValidSend = async(user:any) =>{

	const token = createAuthToken(user.id,user.role);
	const url = `${process.env.IP}:${process.env.DOOR}/confirmation/${token}`;
	console.log(process.env.SENDGRID_API_KEY!);
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

export default emailValidSend;