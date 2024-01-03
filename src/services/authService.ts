import { User } from "../models/User";
import { compareHash } from "../utils/passwordHashCompareUtils";
import { hashPassword } from "../utils/passwordHashUtils";
import { generateToken } from "../utils/tokenUtils";


export const authenticateUser = async (loginIdentifier: string, password: string) => {
	const user = await User.findOne({
		$or: [
			{ email: loginIdentifier },
			{ username: loginIdentifier }
		]
	});

	if (!user) {
		throw new Error("Usuário não encontrado");
	}
	const checkPassword = await compareHash(password, user.password);
	if (!checkPassword) {
		throw new Error("Senha incorreta");
	}
	return generateToken(user);
};

export const changeUserPassword = async (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Usuário não encontrado");
	}

	const checkPassword = await compareHash(oldPassword, user.password);

	if (!checkPassword) {
		throw new Error("Senha incorreta");
	}

	if (newPassword !== confirmPassword) {
		throw new Error("Senhas não conferem");
	}

	const passwordHash = await hashPassword(newPassword);
	user.password = passwordHash;

	await user.save();
};