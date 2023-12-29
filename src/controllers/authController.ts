import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {User} from "../models/User";



import { generateToken } from "../utils/tokenUtils";

import { createUser } from "./userController";
import { hashPassword } from "../utils/passwordHashUtils";
import { compareHash } from "../utils/passwordHashCompareUtils";

export const ping = (req : Request, res : Response 		) => { 
	const authHeader = req.headers.authorization;
	res.json({ pong: authHeader });
};
 
export const register = [
	
	body("name").trim().escape().notEmpty().withMessage("Nome não informado"),
	body("email").toLowerCase().isEmail().withMessage("E-mail não informado").normalizeEmail()
		.custom(async (value) => {
			const user = await User.findOne({ email: value });
			if (user) {
				return Promise.reject("E-mail já está em uso");
			}
		}),
	body("username").trim().escape().notEmpty().withMessage("Nome de usuário não informado").custom(async (value) => {
		const user = await User.findOne({ username: value });
		if (user) {
			return Promise.reject("Nome de usuário já está em uso");
		}
	}),
	body("password").trim().escape().notEmpty().withMessage("Senha não informada"),
	body("confirmPassword").trim().escape().notEmpty().withMessage("Confirmação de senha não informada").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation does not match password");
		}
		return true;
	}),
	
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		await createUser(req, res);
	}
];

export const login = [
	body("loginIdentifier").trim().escape().notEmpty().withMessage("E-mail ou nome de usuário não informado"),
	body("password").trim().escape().notEmpty().withMessage("Senha não informada"),

	async (req: Request, res: Response) => {
		const { loginIdentifier, password } = req.body;

		const user = await User.findOne({
			$or: [
				{ email: loginIdentifier },
				{ username: loginIdentifier }
			]
		});

		if (!user) {
			return res.status(422).json({ error: "Usuário não encontrado" });
		}

		const checkPassword = await compareHash(password, user.password);

		if (!checkPassword) {
			return res.status(422).json({ error: "Senha incorreta" });
		}

		try {
			const token = generateToken(user);
			res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
		} catch (error) {
			res.status(401).json({ error: "Falha na autenticação" });
		}
	}
];


export const changePassword = [
	body("email")
		.isEmail().withMessage("E-mail não informado")
		.normalizeEmail(),
	body("password")
		.trim().escape().notEmpty().withMessage("Senha não informada"),
	body("newPassword")
		.trim().escape().notEmpty().withMessage("Nova senha não informada"),
	body("confirmPassword")
		.trim().escape().notEmpty().withMessage("Confirmação de senha não informada"),

	async (req: Request, res: Response) => {
		const { email, newPassword, confirmPassword } = req.body;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(404).json({ error: "Usuário não encontrado" });
			}

			const checkPassword = await compareHash(req.body.password, user.password);

			if (!checkPassword) {
				return res.status(422).json({ error: "Senha incorreta" });
			}

			if (newPassword !== confirmPassword) {
				return res.status(422).json({ error: "Senhas não conferem" });
			}

			const passwordHash = await hashPassword(newPassword);
			user.password = passwordHash;

			await user.save();

			res.status(200).json({ message: "Senha alterada com sucesso" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao alterar a senha" });
		}
	}
];