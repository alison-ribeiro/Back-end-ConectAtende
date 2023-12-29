import { Request, Response } from "express";

import {User} from "../models/User";
import { hashPassword } from "../utils/passwordHashUtils";

export const createUser = async (req : Request, res : Response 	) => {
	const passwordHash:string = await hashPassword(req.body.password);

	const user = new User({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: passwordHash,
		role: "admin"
	});

	try {
		const savedUser = await user.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json({ error: "Erro ao salvar no servidor" });
	}
};