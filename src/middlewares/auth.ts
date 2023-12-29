
import { NextFunction, Request, Response } from "express";

import { IUser } from "../models/User";
import passport from "../config/passport";
const notAuthorizedJson = {status: 401, message: "Not Authorized"};


export const roleRoute = (requiredRole:string )=> {
	return (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate("jwt", (err: Error, user: IUser) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				return next(notAuthorizedJson);
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