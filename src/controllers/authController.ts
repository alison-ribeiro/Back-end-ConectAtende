import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {User} from "../models/User";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const ping = (req : Request, res : Response 		) => { 

	res.json({ pong: true });
};

export const register = [
	
	body("name").trim().escape().notEmpty().withMessage("Nome não informado"),
	body("email").isEmail().normalizeEmail().withMessage("E-mail não informado"),
	body("password").trim().escape().notEmpty().withMessage("Senha não informada"),
	body("confirmPassword").trim().escape().notEmpty().withMessage("Confirmação de senha não informada").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation does not match password");
		}
		// Indicates the success of this synchronous custom validator
		return true;
	}),

	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}


		const userExists = await User.findOne({ email: req.body.email });

		if(userExists) {
			return res.status(409).json({ error: "E-mail já cadastrado" });
		}
		const salt = await bcrypt.genSalt(12);
		const passwordHash = await bcrypt.hash(req.body.password, salt);

		const user = new User({
			name: req.body.name,
			email:req.body.email,
			password: passwordHash
		});
		try {
			const savedUser = await user.save();
			res.status(201).json(savedUser);
		} catch (error) {
			res.status(500).json({ error: "Erro ao salvar no servidor"});
		}


	}
];

export const login = [
	
	
	body("email").isEmail().normalizeEmail().withMessage("E-mail não informado"),
	body("password").trim().escape().notEmpty().withMessage("Senha não informada"),

	async (req: Request, res: Response) => {
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const user = await User.findOne({ email: req.body.email });

		if(!user) {
			return res.status(422).json({ error: "Usuario não encontrado" });
		}
		const checkPassword = await bcrypt.compare(req.body.password, user.password);
		if (!checkPassword){
			return res.status(422).json({ error: "Senha ou email incorreto" });
		}
		try {
			const secret = process.env.JWT_SECRET as string;
			const token = JWT.sign(
				{
					id:user._id,
				},
				secret,
			);

			res.status(200).json({msg: "Autenticação realizada com sucesso", token });
		} catch (error) {
			
		}

	}
];

// export const changePassword = async (req: Request, res: Response) => {
	
// };