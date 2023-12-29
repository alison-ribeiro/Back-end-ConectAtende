import { Document, model, Schema, Types } from "mongoose";

interface IMessage {
  sender: Types.ObjectId;
  content: string;
  timestamp: Date;
}

export interface IClientMessage extends Document {
  name: string;
  phone: number;
  status: string;
  messages: IMessage[];
}

const UserSchema = new Schema<IClientMessage>({
	name: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true,
		unique: true
	},
	status: {
		type: String,
		required: true,
		enum: ["pending", "finished"],
		default: "pending"
	},
	messages: [{
		sender: {
			type: Types.ObjectId,
			ref: "User", 
			required: true
		},
		content: {
			type: String,
			required: true
		},
		timestamp: {
			type: Date,
			default: Date.now
		}
	}]
});

export const User = model<IClientMessage>("User", UserSchema);