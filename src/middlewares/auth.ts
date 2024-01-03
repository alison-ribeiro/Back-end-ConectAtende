
import { NextFunction, Request, Response } from "express";
import passport from "../config/passport";
import { IUser } from "../models/User";

const notAuthorizedJson = {status: 401, message: "Not Authorized"};
export const roleRoute = (requiredRole:string )=> {
	return (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate("jwt", (err: Error, user: IUser) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				console.log(user);
				return next(notAuthorizedJson);// adicione mais lojas conforme necessário
			}
			req.user = user;
			if (user.role === requiredRole) {
				return next();
			} else {
				
				return next(notAuthorizedJson);
			}
		})(req, res, next);
	};
};