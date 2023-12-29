import bcrypt from "bcrypt";

export async function compareHash (password:string,passwordDB:string): Promise<boolean> {
	return await bcrypt.compare(password, passwordDB);
}