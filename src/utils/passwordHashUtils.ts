import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(12);
	const passwordHash = await bcrypt.hash(password, salt);
	return passwordHash;
}