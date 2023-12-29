import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy} from "passport-jwt";
import { User } from "../models/User";

import dotenv from "dotenv";


dotenv.config();

const notAuthorizedJson = {status: 401, message: "Not Authorized"};

const options  = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET as string
};

passport.use(new JWTStrategy(options, async (payload: { id: string, role: string }, done) => {
	const user = await User.findById(payload.id);
	if (user) {
		done(null, { ...user.toObject(), role: payload.role });
	} else {

		done(notAuthorizedJson, false);
	}
}));
export default passport;