import { IUser } from "../models/User";
import jwt from "jsonwebtoken";

export function generateToken (user: IUser)  {
	return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
}