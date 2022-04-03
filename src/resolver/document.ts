import { Resolver, Mutation, Arg, Ctx, Query } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Stream } from 'stream';
import { PrismaClient } from '@prisma/client';
import { getTokenId } from '../utils';
import { randomBytes }  from 'crypto';
import fs from 'fs';
import { DocumentAll } from '../dto/document';


export const prisma = new PrismaClient();

@Resolver()
export class DocumentPictureResolver {
	@Mutation(() => Boolean, { nullable: true })
	async addDocumentPicture( @Ctx() ctx: any, @Arg('picture', () => GraphQLUpload )
		{
			createReadStream,
			filename,

		}: Upload): Promise<boolean> {
		console.log('ent');
		if(!(filename.includes('.jpg') || filename.includes('.pdf') || filename.includes('.jpeg') || filename.includes('.png')) ){
			return false;
		}
		let idValid =1;
		try{
			idValid = getTokenId(ctx)?.userId;
			idValid = 3;
			if (!await prisma.user.findFirst({ where: { id: idValid } }) || idValid == null) {
				return false;
			}
		}catch{
			return false;
		}
		console.log('entsssss');

		const hashName = createHash();
		if(verificationExist(__dirname + `/../../images/${hashName}-${filename}`)){
			return false;
		}

		return new Promise( (resolve, reject) =>
			createReadStream()
				.pipe(createWriteStream(__dirname + `/../../images/${hashName}-${filename}`))
				.on('finish', async () =>{
					if ( await saveDocument({fileName:`${hashName}-${filename}`,userId:idValid})){
						resolve(true);
					}else{
						reject(false);
					}
				})
				.on('error', () => reject(false))
		);
	}
	@Query(() => [DocumentAll])
	async allDocuments(){
		return prisma.document.findMany();
	}

}



export interface Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}

export const createHash =() =>{
	const hash = randomBytes(32);
	console.log(hash.toString('hex'));
	return hash.toString('hex');
};


const verificationExist =(path:string) =>{
	try {
		if (fs.existsSync(path)) {
			return true;
		}
	} catch(err) {
		return false;
	}
};


interface typeSaveDocument{
	fileName:string
	userId:number
}
const saveDocument = async (data: typeSaveDocument) =>{
	try{
		await prisma.document.create({data});
		return true;
	}catch{
		console.log('document');

		return false;
	}
};