import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {User} from "../models/User";
import { createUser } from "./userController";
import { authenticateUser, changeUserPassword } from "../services/authService";

 
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

		try {
			const token = await authenticateUser(loginIdentifier, password);
			res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
		} catch (error) {
			res.status(401).json({ error: error });
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
		const { email, password, newPassword, confirmPassword } = req.body;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		try {
			await changeUserPassword(email, password, newPassword, confirmPassword);
			res.status(200).json({ message: "Senha alterada com sucesso" });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	}
];