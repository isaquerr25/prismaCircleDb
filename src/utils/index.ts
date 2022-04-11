import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const validateCreateUser =  async (fetchUser:any) => {

	const resend = [];
	// console.log(fetchUser)

	if (!validatePassword(fetchUser.password)){
		resend.push({field:'password',message:'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'});
	}
	if (!validateEmail(fetchUser.email)){
		resend.push({field:'email',message:'email wrong'});
	}
	if (!validateName(fetchUser.name)){
		resend.push({field:'name',message:'fields not filled in correctly'});
	}
	// console.log(resend)
	return(resend);
};

export const HashGenerator =  async ( password: string ) => {

	console.log('hashedPassword');
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	console.log(hashedPassword);
	return (hashedPassword);

};

export const validatePassword = (password: string) => {
	return String(password).match(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/
	);
};

const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

const validateName = (name: string) => {
	return String(name)
		.match(
			/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
		);
};

export const createAuthToken = (user:number,role:unknown) => {
	const privateKey:string = process.env.JWT_KEY != undefined ? process.env.JWT_KEY : '';
	const tokenData = {
		userId: user,
		role: role,
	};
	const token = jwt.sign(tokenData, privateKey);
	
	return token;
};

export const validateLogin = async (passwordDB:string,password:string,userId:number,role:unknown) => {
	if (await bcrypt.compare(password, passwordDB)){
		return await createAuthToken(userId,role);
	}
	else{
		return null;
	}
};

export const decodeToken = (token:string) => {
	// token = token.replace('access-token=','');

	try{
		return(jwt.decode(token));
	}catch{
		return(null);
	}
};

interface JwtPayload {
	userId: number;
	role:string;
}

export const decodeTokenType = (info: any) => {

	return decodeToken(info) as JwtPayload;
};

export const getTokenId = (ctx: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { res, req } = ctx;

	return decodeToken(req.cookies['access-token']) as JwtPayload;
};