import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
	role:string;
	username:string;
}

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		enum: ["admin", "attendant"],
		default: "attendant"
	}
});

export const User = model<IUser>("User", UserSchema);